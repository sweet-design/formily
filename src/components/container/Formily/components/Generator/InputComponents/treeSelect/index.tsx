import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '@/components/container/Formily/utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import dynamicDataGenerator from '../../../../utils/dynamicDataGenerator';
import { isNull, isArray, isUndefined, isObject } from 'lodash';
import { executeStr } from '../../../../utils/format';

@Component
export default class TreeSelect extends Mixins(mixin) {
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
  private dynamicDatas: any = [];

  // 选中回调数据，来自change事件数据
  private selectedCallbackData: any = null;

  get transValue() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const changeValue = this.directModels[fieldProperties.name];

    if (isNull(this.selectedCallbackData)) {
      if (isUndefined(changeValue)) {
        return 'N/A';
      } else {
        return this.transLabel(this.dataFactory(changeValue));
      }
    } else {
      return this.transLabel(
        this.dataFactory(this.transSelectedCallback(this.selectedCallbackData)),
      );
    }
  }

  // 计算change事件所产生的数据，为了提升性能，不要在每次change时来做计算
  private transSelectedCallback(data: any) {
    if (isNull(data.label)) {
      return JSON.parse(JSON.stringify(data.value));
    } else {
      if (isArray(data.value)) {
        return data.value.map((item: any, index: number) => ({
          value: item,
          label: data.label[index],
        }));
      } else {
        return { value: data.value, label: data.label[0] };
      }
    }
  }

  /**
   * 数据工厂
   * @returns {Object} 当前选中值的明细数据
   */
  private dataFactory(data: any): any {
    const componentProperties = this.currentConfig.componentProperties;

    if (componentProperties.treeCheckable || componentProperties.multiple) {
      if (componentProperties.treeCheckStrictly || componentProperties.labelInValue) {
        // 此时为对象数组
        return this.loopData(
          data.map((item: any) => {
            return item.value || null;
          }),
          true,
        );
      } else {
        // 此时为字符串数组或者数值数组
        return this.loopData(data, true);
      }
    } else {
      if (componentProperties.labelInValue) {
        // 此时为对象
        return this.loopData(data.value, false);
      } else {
        // 此时为字符串或者数值
        return this.loopData(data, false);
      }
    }
  }

  /**
   * 转换显示数据
   * @param data 选中值的明细数据
   */
  private transLabel(data: any): any {
    const fieldProperties = this.currentConfig.fieldProperties;

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, data);
      } catch (e) {
        this.$message.error('格式化函数处理错误');
        return 'N/A';
      }
    }

    if (isArray(data)) {
      return data.map((item: any) => item.label).join(',') || 'N/A';
    } else {
      return data.label || 'N/A';
    }
  }

  /**
   * 在全量数据源下，根据选中节点的标识或者标识列表查找明细数据
   * @param selected 已选中的值
   * @param multiple 是否为多选
   * @returns 选中项的 labelInValue 值
   */
  private loopData(
    selected: string | string[],
    multiple: boolean,
  ): Array<{ label: string; value: string }> {
    const replaceField = this.config.componentProperties.replaceField;
    const title = replaceField.title;
    const value = replaceField.value;
    const children = replaceField.children;

    const container: any = [];
    const recursion = (data: any[]) => {
      data.forEach((item: any) => {
        if (multiple ? selected.includes(item[value]) : selected === item[value]) {
          container.push({ label: item[title], value: item[value] });
        } else {
          if (item[children] && item[children].length > 0) {
            recursion(item[children]);
          }
        }
      });
    };

    recursion(this.shadowData);

    return multiple ? container : container[0];
  }

  get shadowData() {
    if (this.currentConfig.fieldProperties.dataSource === 'staticData') {
      const staticDatas = this.currentConfig.fieldProperties.staticDatas; // 静态数据
      const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

      const trans = (data: any) => {
        return data.map((item: any) => {
          return {
            [replaceField.title]: this.getLangResult(
              item[replaceField.lang],
              item[replaceField.title],
            ),
            [replaceField.value]: item[replaceField.value],
            [replaceField.children]:
              (item.children && item.children.length > 0 && trans(item.children)) || [],
          };
        });
      };

      return trans(staticDatas);
    } else {
      return this.dynamicDatas;
    }
  }

  async created() {
    const fieldProperties = this.currentConfig.fieldProperties;

    if (fieldProperties.dataSource === 'dynamicData') {
      this.dynamicDatas = await dynamicDataGenerator(this.currentConfig, this.apis);
    }

    // 初始化响应式数据模型
    if (!this.directModels[fieldProperties.name]) {
      this.$set(this.directModels, fieldProperties.name, defaultValueGenerator(this.currentConfig));
    }
  }

  render() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const componentProperties = this.currentConfig.componentProperties;
    const formConfig = this.config.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    // 转换树过滤条件
    let filterTreeNode: any = true;
    try {
      if (componentProperties.filterTreeNode.dataType === 'boolean') {
        filterTreeNode = componentProperties.filterTreeNode.value ? undefined : false;
      } else {
        if (componentProperties.filterTreeNode.value.trim() !== '') {
          filterTreeNode = Function(
            '"use strict";return (' + componentProperties.filterTreeNode.value + ')',
          )();
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    // 转换简单数据模式
    let treeDataSimpleMode = false;
    try {
      if (componentProperties.treeDataSimpleMode.dataType === 'boolean') {
        treeDataSimpleMode = componentProperties.treeDataSimpleMode.value;
      } else {
        if (componentProperties.treeDataSimpleMode.value.trim() !== '') {
          treeDataSimpleMode = JSON.parse(componentProperties.treeDataSimpleMode.value);
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    // 转换默认展开的节点
    let treeDefaultExpandedKeys = undefined;
    try {
      if (componentProperties.treeDefaultExpandedKeys.trim() !== '') {
        treeDefaultExpandedKeys = JSON.parse(componentProperties.treeDefaultExpandedKeys);
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    return (
      <a-tree-select
        treeData={this.shadowData}
        vModel={this.directModels[fieldProperties.name]}
        allowClear={componentProperties.allowClear}
        labelInValue={componentProperties.labelInValue}
        showSearch={componentProperties.showSearch}
        multiple={componentProperties.multiple}
        treeCheckable={componentProperties.treeCheckable}
        treeDefaultExpandAll={componentProperties.treeDefaultExpandAll}
        dropdownMatchSelectWidth={componentProperties.dropdownMatchSelectWidth}
        treeCheckStrictly={componentProperties.treeCheckStrictly}
        showCheckedStrategy={componentProperties.showCheckedStrategy}
        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        treeNodeFilterProp={componentProperties.treeNodeFilterProp}
        treeNodeLabelProp={componentProperties.treeNodeLabelProp}
        filterTreeNode={filterTreeNode}
        treeDataSimpleMode={treeDataSimpleMode}
        dropdownStyle={{ maxHeight: `${componentProperties.listHeight}px` }}
        maxTagCount={componentProperties.maxTagCount || undefined}
        replaceFields={componentProperties.replaceField}
        size={componentProperties.size ?? formConfig.size}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        searchPlaceholder={this.getLangResult(
          componentProperties.searchPlaceholderLangKey,
          componentProperties.searchPlaceholder,
        )}
        onChange={(value: string | string[], label: string[], extra: Record<string, any>) => {
          this.selectedCallbackData = { value, label };

          this.formItemInstance.onFieldChange();
          if (componentProperties.onChange) {
            this.actions[componentProperties.onChange](value, label, extra);
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
      />
    );
  }
}
