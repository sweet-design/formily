import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';

@Component
export default class Password extends Mixins(mixin) {
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

  created() {
    const fieldProperties = this.currentConfig.fieldProperties;

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
      <a-input-password
        vModel={this.directModels[fieldProperties.name]}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        addonAfter={componentProperties.addonAfter}
        addonBefore={componentProperties.addonBefore}
        prefix={componentProperties.prefix}
        suffix={componentProperties.suffix}
        allowClear={componentProperties.allowClear}
        maxLength={componentProperties.maxLength}
        disabled={fieldProperties.pattern === 'disabled'}
        visibilityToggle={componentProperties.visibilityToggle}
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
