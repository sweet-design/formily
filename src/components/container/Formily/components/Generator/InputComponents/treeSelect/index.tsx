import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '@/components/container/Formily/utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import dynamicDataGenerator from '../../../../utils/dynamicDataGenerator';

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
  private dynamicDatas = [];

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
      // 直接返回动态数据载体中的数据
      return this.dynamicDatas;
    }
  }

  async created() {
    const fieldProperties = this.currentConfig.fieldProperties;

    if (fieldProperties.dataSource === 'dynamicData') {
      const dynamicData: any = await dynamicDataGenerator(this.currentConfig, this.apis);

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

      this.dynamicDatas = trans(dynamicData);
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
        treeData={fieldProperties.dataSource === 'staticData' ? this.shadowData : this.dynamicDatas}
        vModel={this.directModels[fieldProperties.name]}
        allowClear={componentProperties.allowClear}
        labelInValue={componentProperties.labelInValue}
        showSearch={componentProperties.showSearch}
        treeCheckable={componentProperties.treeCheckable}
        treeDefaultExpandAll={componentProperties.treeDefaultExpandAll}
        dropdownMatchSelectWidth={componentProperties.dropdownMatchSelectWidth}
        showCheckedStrategy={componentProperties.showCheckedStrategy}
        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        treeNodeFilterProp={componentProperties.treeNodeFilterProp}
        treeNodeLabelProp={componentProperties.treeNodeLabelProp}
        maxTagCount={componentProperties.maxTagCount}
        filterTreeNode={filterTreeNode}
        treeDataSimpleMode={treeDataSimpleMode}
        treeCheckStrictly={componentProperties.treeCheckStrictly}
        dropdownStyle={{ maxHeight: `${componentProperties.listHeight}px` }}
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
