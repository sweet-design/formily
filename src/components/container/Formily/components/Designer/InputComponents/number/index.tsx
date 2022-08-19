import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import { isNull, isUndefined } from 'lodash';
import mixin from '@/components/container/Formily/utils/mixin';

@Component
export default class Number extends Mixins(mixin) {
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

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.config.fieldProperties;

    if (isNull(fieldProperties.defaultValue) || isUndefined(fieldProperties.defaultValue)) {
      return 'N/A';
    }

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, fieldProperties.defaultValue);
      } catch (e) {
        this.$message.error((e as any).message);
        return 'N/A';
      }
    }

    return fieldProperties.defaultValue;
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

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
        value={fieldProperties.defaultValue}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        decimalSeparator={componentProperties.decimalSeparator}
        props={obj}
        max={componentProperties.max ?? Infinity}
        min={componentProperties.min ?? -Infinity}
        step={componentProperties.step ?? 1}
        formatter={formatter}
        parser={parser}
        size={componentProperties.size ?? formConfig.size}
        disabled={fieldProperties.pattern === 'disabled'}
      />
    );
  }
}
