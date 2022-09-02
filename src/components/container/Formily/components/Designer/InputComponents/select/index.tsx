import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { executeStr, isJSON } from '../../../../utils/format';
import mixin from '../../../../utils/mixin';
import { isNull, isString, isArray, isObject, isUndefined } from 'lodash';

@Component
export default class Select extends Mixins(mixin) {
  /**
   * 单个字段配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  config!: any;

  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  allConfig!: any;

  // 动态数据
  private dynamicDatas: any[] = [];

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.config.fieldProperties;
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

    if (this.config.componentProperties.mode === 'multiple') {
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
    const defaultValue = this.config.fieldProperties.defaultValue.value;

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

    if (this.config.componentProperties.mode === 'multiple') {
      if (!isJSON(defaultValue)) return null;

      const temp = JSON.parse(defaultValue);

      if (!isArray(temp) || (isArray(temp) && temp.length === 0)) return null;

      if (this.config.componentProperties.labelInValue) {
        return tempDataSource.filter(
          (item: any) => temp.filter((sub: any) => sub.key === item.value).length > 0,
        );
      } else {
        return tempDataSource.filter((item: any) => temp.includes(item.value));
      }
    } else {
      if (this.config.componentProperties.labelInValue) {
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
    if (this.config.fieldProperties.dataSource === 'staticData') {
      const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
      const replaceField = this.config.componentProperties.replaceField; // 替换字段

      return staticDatas.map((item: any) => {
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
    } else {
      // 直接返回动态数据
      return this.dynamicDatas;
    }
  }

  // 预览值
  private previewValue: any = null;

  // 监听默认值变动
  @Watch('config.fieldProperties.defaultValue', { deep: true })
  private defaultValueChangeHandle() {
    this.updatePreviewValue();
  }

  // 监听组件选择模式的变动
  @Watch('config.componentProperties.mode')
  private modeChangeHandle(newValue: any) {
    this.updatePreviewValue();
  }

  // 监听是否为标签值的变动
  @Watch('config.componentProperties.labelInValue')
  private labelInValueChangeHandle(newValue: any) {
    this.updatePreviewValue();
  }

  created() {
    this.updatePreviewValue();
  }

  // 更新预览值
  private updatePreviewValue() {
    const defaultValue = this.config.fieldProperties.defaultValue;
    const componentProperties = this.config.componentProperties;

    if (
      isNull(defaultValue.value) ||
      (isString(defaultValue.value) && defaultValue.value.trim() === '')
    ) {
      this.previewValue = null;
      return;
    }

    if (componentProperties.mode === 'multiple') {
      if (defaultValue.dataType !== 'expression') {
        this.$message.error('请将默认值类型设置为表达式，再进行配置json格式数据', 5);
        this.previewValue = null;
        return;
      }

      if (!isJSON(defaultValue.value)) {
        this.$message.error('请设置正确的数据格式', 5);
        this.previewValue = null;
        return;
      }

      const temp = JSON.parse(defaultValue.value);

      if (!isArray(temp)) {
        this.$message.error('请设置正确的数据格式', 5);
        this.previewValue = null;
        return;
      }

      if (componentProperties.labelInValue) {
        // 对象数组
        for (let i = 0; i < temp.length; i++) {
          if (!isObject(temp[i])) {
            this.$message.error('请设置正确的数据格式', 5);
            this.previewValue = null;
            return;
          }
        }
      } else {
        // 字符串数组或者数值数组
        for (let i = 0; i < temp.length; i++) {
          if (isObject(temp[i])) {
            this.$message.error('请设置正确的数据格式', 5);
            this.previewValue = null;
            return;
          }
        }
      }

      this.previewValue = temp;
    } else {
      if (componentProperties.labelInValue) {
        if (defaultValue.dataType !== 'expression') {
          this.$message.error('请将默认值类型设置为表达式，再进行配置json格式数据', 5);
          this.previewValue = null;
          return;
        }

        if (!isJSON(defaultValue.value)) {
          this.$message.error('请设置正确的数据格式', 5);
          this.previewValue = null;
          return;
        }

        const temp = JSON.parse(defaultValue.value);

        if (!temp.key || isObject(temp.key)) {
          this.$message.error('请设置正确的数据格式', 5);
          this.previewValue = null;
          return;
        }

        this.previewValue = temp;
        return;
      }

      this.previewValue = defaultValue.value;
    }
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

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
        optionLabelProp={componentProperties.optionLabelProp}
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
          this.getLangResult(
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
        value={this.previewValue || undefined}
        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
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
