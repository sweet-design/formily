import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';

@Component
export default class Slider extends Mixins(mixin) {
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

    if (!fieldProperties.defaultValue) {
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

  // 提示信息
  get transToolTips() {
    const componentProperties = this.config.componentProperties;
    return componentProperties.tooltips.map((item: any) => {
      return this.getLangResult(item.tipsLangKey, item.tips);
    });
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;

    let marks = null;
    try {
      marks = Function('"use strict";return (' + componentProperties.marks + ')')()();
    } catch (e) {
      marks = {};
    }

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    return (
      <a-slider
        disabled={fieldProperties.pattern === 'disabled'}
        style="width: 100%"
        dots={componentProperties.dots}
        range={componentProperties.range}
        reverse={componentProperties.reverse}
        vertical={componentProperties.vertical}
        tooltipVisible={
          componentProperties.tooltipVisible === undefined
            ? undefined
            : componentProperties.tooltipVisible === 'true'
            ? true
            : false
        }
        tooltipPlacement={componentProperties.tooltipPlacement}
        marks={marks}
        included={componentProperties.included}
        max={componentProperties.max}
        min={componentProperties.min}
        step={componentProperties.step || null}
      />
    );
  }
}
