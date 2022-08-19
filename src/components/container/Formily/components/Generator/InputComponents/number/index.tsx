import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';

@Component
export default class Number extends Mixins(mixin) {
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

    let formatter = null;
    try {
      if (componentProperties.formatter?.trim() !== '') {
        formatter = Function('"use strict";return (' + componentProperties.formatter + ')')();
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    let parser = null;
    try {
      if (componentProperties.parser?.trim() !== '') {
        parser = Function('"use strict";return (' + componentProperties.parser + ')')();
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    const obj: any = {};

    if (componentProperties.precision) {
      obj.precision = componentProperties.precision;
    }

    return (
      <a-input-number
        style="width: 100%"
        vModel={this.directModels[fieldProperties.name]}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        decimalSeparator={componentProperties.decimalSeparator}
        props={obj}
        max={componentProperties.max ?? Infinity}
        min={componentProperties.min ?? -Infinity}
        formatter={formatter}
        parser={parser}
        step={componentProperties.step ?? 1}
        size={componentProperties.size ?? formConfig.size}
        disabled={fieldProperties.pattern === 'disabled'}
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
