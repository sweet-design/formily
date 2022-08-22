import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import dynamicDataGenerator from '../../../../utils/dynamicDataGenerator';

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

  // 根据替换字段需要转换的数据
  get shadowData() {
    if (this.currentConfig.fieldProperties.dataSource === 'staticData') {
      const staticDatas = this.currentConfig.fieldProperties.staticDatas; // 静态数据
      const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

      return staticDatas.map((item: any) => {
        return {
          ...item,
          label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
          value: item[replaceField.value],
        };
      });
    } else {
      // 直接返回动态数据载体中的数据
      return this.currentConfig.fieldProperties.dynamicDatas;
    }
  }

  async created() {
    const fieldProperties = this.currentConfig.fieldProperties;

    if (fieldProperties.dataSource === 'dynamicData') {
      const dynamicData: any = await dynamicDataGenerator(this.currentConfig, this.apis);

      const replaceField = this.currentConfig.componentProperties.replaceField; // 替换字段

      fieldProperties.dynamicDatas = dynamicData.map((item: any) => {
        return {
          label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
          value: item[replaceField.value],
        };
      });
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

    return (
      <a-select
        mode={componentProperties.mode}
        vModel={this.directModels[fieldProperties.name]}
        showSearch={componentProperties.showSearch}
        optionFilterProp="children"
        filterOption={componentProperties.filterOption.value}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        allowClear={componentProperties.allowClear}
        disabled={fieldProperties.pattern === 'disabled'}
        options={
          fieldProperties.dataSource === 'staticData'
            ? this.shadowData
            : fieldProperties.dynamicDatas
        }
        labelInValue={componentProperties.labelInValue}
        onChange={() => {
          this.formItemInstance.onFieldChange();
          if (componentProperties.onChange) {
            this.actions[componentProperties.onChange]();
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
