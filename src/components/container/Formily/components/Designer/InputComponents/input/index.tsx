import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';

@Component
export default class Input extends Mixins(mixin) {
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

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, fieldProperties.defaultValue);
      } catch (e) {
        this.$message.error((e as any).message);
      }
    }

    if (fieldProperties.defaultValue.trim() === '') {
      return 'N/A';
    }

    return fieldProperties.defaultValue;
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    return fieldProperties.pattern === 'readPretty' ? (
      <div class="control-text">{this.transValue}</div>
    ) : (
      <a-input
        readOnly
        value={fieldProperties.defaultValue}
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
      />
    );
  }
}
