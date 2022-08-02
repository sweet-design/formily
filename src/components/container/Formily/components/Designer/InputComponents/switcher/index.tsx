import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';

@Component
export default class Switcher extends Mixins(mixin) {
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
    const result = fieldProperties.defaultValue
      ? this.checkedChildrenContent
      : this.unCheckedChildrenContent;

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, result);
      } catch (e) {
        this.$message.error((e as any).message);
        return 'N/A';
      }
    }

    return result;
  }

  /**
   * 缓存选中时显示的内容
   */
  get checkedChildrenContent() {
    const componentProperties = this.config.componentProperties;

    return this.getLangResult(
      componentProperties.checkedChildrenLangKey,
      componentProperties.checkedChildren,
    );
  }

  /**
   * 缓存非选中时显示的内容
   */
  get unCheckedChildrenContent() {
    const componentProperties = this.config.componentProperties;

    return this.getLangResult(
      componentProperties.unCheckedChildrenLangKey,
      componentProperties.unCheckedChildren,
    );
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    return fieldProperties.pattern === 'readPretty' ? (
      <div class="control-text">{this.transValue}</div>
    ) : (
      <a-switch
        vModel={fieldProperties.defaultValue}
        autoFocus={componentProperties.autoFocus}
        checkedChildren={this.checkedChildrenContent}
        unCheckedChildren={this.unCheckedChildrenContent}
        disabled={fieldProperties.pattern === 'disabled'}
        size={componentProperties.size ?? formConfig.size}
      />
    );
  }
}
