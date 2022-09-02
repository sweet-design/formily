import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import dynamicDataGenerator, { fetchData } from '../../../../utils/dynamicDataGenerator';
import { executeStr, isJSON } from '../../../../utils/format';
import { isNull, isString, debounce, isArray, isUndefined } from 'lodash';
import { VNode } from 'vue';

@Component
export default class Select extends Mixins(mixin) {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  /**
   * 当前控件配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  currentConfig!: any;

  /**
   * 动作响应池数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  actions!: any;

  /**
   * api接口数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  apis!: any;

  /**
   * 表单数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  models!: any;

  /**
   * 表单项实例
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  formItemInstance!: any;

  /**
   * 字段路径
   */
  @Prop({
    type: String,
    default: '',
  })
  path!: string;

  /**
   * 直属上层数据对象，为了给v-model做数据绑定使用
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  directModels!: any;

  // 动态数据
  private dynamicDatas = [];

  // 最后一次请求编号
  private lastFetchId = 0;

  // 是否在请求中
  private fetching = false;

  get transValue() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const newValue = this.dataFactory();

    if (!newValue) {
      return 'N/A';
    }

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, newValue);
      } catch (e) {
        this.$message.error('格式化函数处理错误');
        return 'N/A';
      }
    }

    if (this.currentConfig.componentProperties.mode === 'multiple') {
      return newValue.map((item: any) => item.label).join(',') || 'N/A';
    } else {
      return newValue.label || 'N/A';
    }
  }

  /**
   * @name 数据工厂
   * @returns {string} 当前选中值的lable
   */
  private dataFactory(): any {
    const defaultValue = this.currentConfig.fieldProperties.defaultValue.value;

    if (isNull(defaultValue) || (isString(defaultValue) && defaultValue.trim() === '')) {
      return null;
    }

    // 如果出现分组，需将数据拉平后再处理
    const tempDataSource: string | any[] = [];
    this.shadowData.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((sub: any) => {
          tempDataSource.push(sub);
        });
      } else {
        tempDataSource.push(item);
      }
    });

    if (this.currentConfig.componentProperties.mode === 'multiple') {
      if (!isJSON(defaultValue)) return null;

      const temp = JSON.parse(defaultValue);

      if (!isArray(temp) || (isArray(temp) && temp.length === 0)) return null;

      if (this.currentConfig.componentProperties.labelInValue) {
        return tempDataSource.filter(
          (item: any) => temp.filter((sub: any) => sub.key === item.value).length > 0,
        );
      } else {
        return tempDataSource.filter((item: any) => temp.includes(item.value));
      }
    } else {
      if (this.currentConfig.componentProperties.labelInValue) {
        if (!isJSON(defaultValue)) return null;

        const temp = JSON.parse(defaultValue);

        if (isArray(temp) || isUndefined(temp.key)) return null;

        return tempDataSource.find((item: any) => item.value === temp.key);
      } else {
        return tempDataSource.find((item: any) => item.value === defaultValue);
      }
    }
  }

  // 根据替换字段需要转换的数据
  get shadowData() {
    if (this.currentConfig.fieldProperties.dataSource === 'staticData') {
      const staticDatas = this.currentConfig.fieldProperties.staticDatas; // 静态数据
      const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

      return staticDatas.map((item: any) => {
        return {
          label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
          value: item[replaceField.value],
          disabled: item.disabled ? true : false,
        };
      });
    } else {
      // 直接返回动态数据
      return this.dynamicDatas;
    }
  }

  async created() {
    this.fetchData = debounce(this.fetchData, 800);

    const fieldProperties = this.currentConfig.fieldProperties;

    if (fieldProperties.dataSource === 'dynamicData') {
      this.fetching = true;
      const dynamicData: any = await dynamicDataGenerator(this.currentConfig, this.apis);

      const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

      this.dynamicDatas = dynamicData.map((item: any) => {
        const childrenKey = replaceField.children || 'children';
        return {
          label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
          value: item[replaceField.value],
          disabled: item.disabled ? true : false,
          children:
            (item[childrenKey] &&
              item[childrenKey].length > 0 &&
              item[childrenKey].map((sub: any) => {
                return {
                  label: this.getLangResult(sub[replaceField.lang], sub[replaceField.label]),
                  value: sub[replaceField.value],
                  disabled: sub.disabled ? true : false,
                };
              })) ||
            undefined,
        };
      });

      this.fetching = false;
    }

    // 初始化响应式数据模型
    if (!this.directModels[fieldProperties.name]) {
      this.$set(this.directModels, fieldProperties.name, defaultValueGenerator(this.currentConfig));
    }
  }

  // 查询列表数据
  private fetchData(value: string) {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.dynamicDatas = [];
    this.fetching = true;

    fetchData(this.currentConfig.componentProperties.remoteSearch, this.apis, value).then(
      (data: any) => {
        if (fetchId !== this.lastFetchId) return;

        const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

        this.dynamicDatas = data.map((item: any) => {
          const childrenKey = replaceField.children || 'children';

          return {
            label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
            value: item[replaceField.value],
            disabled: item.disabled ? true : false,
            children:
              (item[childrenKey] &&
                item[childrenKey].length > 0 &&
                item[childrenKey].map((sub: any) => {
                  return {
                    label: this.getLangResult(sub[replaceField.lang], sub[replaceField.label]),
                    value: sub[replaceField.value],
                    disabled: sub.disabled ? true : false,
                  };
                })) ||
              undefined,
          };
        });

        this.fetching = false;
      },
    );
  }

  render() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const componentProperties = this.currentConfig.componentProperties;
    const formConfig = this.config.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    // 转换树过滤条件
    let filterOption: any = true;
    try {
      if (componentProperties.filterOption.dataType === 'boolean') {
        filterOption = componentProperties.filterOption.value;
      } else {
        if (componentProperties.filterOption.value.trim() !== '') {
          filterOption = Function(
            '"use strict";return (' + componentProperties.filterOption.value + ')',
          )();
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    return (
      <a-select
        mode={componentProperties.mode}
        allowClear={componentProperties.allowClear}
        autoClearSearchValue={componentProperties.autoClearSearchValue}
        dropdownMatchSelectWidth={componentProperties.dropdownMatchSelectWidth}
        autoFocus={componentProperties.autoFocus}
        defaultActiveFirstOption={componentProperties.defaultActiveFirstOption}
        defaultOpen={componentProperties.defaultOpen}
        labelInValue={componentProperties.labelInValue}
        showArrow={componentProperties.showArrow}
        showSearch={componentProperties.showSearch}
        optionFilterProp={componentProperties.optionFilterProp}
        filterOption={filterOption}
        dropdownStyle={
          componentProperties.listHeight
            ? {
                maxHeight: componentProperties.listHeight + 'px',
                overflow: 'auto',
              }
            : {}
        }
        maxTagCount={componentProperties.maxTagCount || undefined}
        maxTagPlaceholder={
          this.getLangResult(
            componentProperties.maxTagPlaceholderLangKey,
            componentProperties.maxTagPlaceholder,
          ) || undefined
        }
        maxTagTextLength={componentProperties.maxTagTextLength || undefined}
        notFoundContent={
          this.fetching
            ? undefined
            : this.getLangResult(
                componentProperties.notFoundContentLangKey,
                componentProperties.notFoundContent,
              ) || undefined
        }
        size={componentProperties.size ?? formConfig.size}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        disabled={fieldProperties.pattern === 'disabled'}
        vModel={this.directModels[fieldProperties.name]}
        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
        onSearch={(value: string) => {
          if (componentProperties.remoteSearch.key) {
            this.fetchData(value);
          }
        }}
        onChange={(
          value:
            | string
            | number
            | string[]
            | number[]
            | { key: string | number; label: string }
            | { key: string | number; label: string }[],
          option: VNode | VNode[],
        ) => {
          this.formItemInstance.onFieldChange();
          if (componentProperties.onChange) {
            this.actions[componentProperties.onChange](value, option);
          }
        }}
        onBlur={() => {
          this.formItemInstance.onFieldBlur();
          if (componentProperties.onBlur) {
            this.actions[componentProperties.onBlur]();
          }
        }}
        onFocus={() => {
          if (componentProperties.onFocus) {
            this.actions[componentProperties.onFocus]();
          }
        }}
        scopedSlots={
          this.fetching && {
            notFoundContent: () => {
              return <a-spin size="small" />;
            },
          }
        }
      >
        {this.shadowData.map((item: any) => {
          if (item.children && item.children.length > 0) {
            return (
              <a-select-opt-group label={item.label} key={item.value}>
                {item.children.map((sub: any) => {
                  return (
                    <a-select-option
                      key={sub.value}
                      value={sub.value}
                      label={sub.label}
                      disabled={sub.disabled}
                    >
                      {sub.label}
                    </a-select-option>
                  );
                })}
              </a-select-opt-group>
            );
          } else {
            return (
              <a-select-option
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
              >
                {item.label}
              </a-select-option>
            );
          }
        })}
      </a-select>
    );
  }
}
