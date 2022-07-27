import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import TimeRange from '../../../TimeRangePicker';

@Component
export default class TimeRangePicker extends Mixins(mixin) {
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

    if (!fieldProperties.defaultValue || fieldProperties.defaultValue.length === 0) {
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

    return fieldProperties.defaultValue.join('~');
  }

  // 缓存并校验禁用小时函数
  get disabledHoursFun() {
    try {
      if (this.config.componentProperties.disabledHours.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledHours + ')',
      )();
    } catch (e) {
      this.$message.error('禁用小时代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  // 缓存并校验禁用分钟函数
  get disabledMinutesFun() {
    try {
      if (this.config.componentProperties.disabledMinutes.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledMinutes + ')',
      )();
    } catch (e) {
      this.$message.error('禁用分钟代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  // 缓存并校验禁用秒函数
  get disabledSecondsFun() {
    try {
      if (this.config.componentProperties.disabledSeconds.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledSeconds + ')',
      )();
    } catch (e) {
      this.$message.error('禁用秒代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    return (
      <TimeRange
        style="width: 100%"
        vModel={fieldProperties.defaultValue}
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={[
          this.getLangResult(
            componentProperties.startPlaceholderLangKey,
            componentProperties.startPlaceholder,
          ),
          this.getLangResult(
            componentProperties.endPlaceholderLangKey,
            componentProperties.endPlaceholder,
          ),
        ]}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format || 'HH:mm:ss'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledHours={this.disabledHoursFun}
        disabledMinutes={this.disabledMinutesFun}
        disabledSeconds={this.disabledSecondsFun}
        hideDisabledOptions={componentProperties.hideDisabledOptions}
        use12Hours={componentProperties.use12Hours}
        hourStep={componentProperties.hourStep}
        minuteStep={componentProperties.minuteStep}
        secondStep={componentProperties.secondStep}
        showNow={componentProperties.showNow}
        clearText={this.getLangResult(
          componentProperties.clearTextLangKey,
          componentProperties.clearText,
        )}
      />
    );
  }
}
