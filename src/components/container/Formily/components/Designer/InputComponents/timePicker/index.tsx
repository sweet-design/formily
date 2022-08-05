import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import moment from 'moment';

@Component
export default class TimePicker extends Mixins(mixin) {
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

  // 是否打开
  private isOpen = false;

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.config.fieldProperties;

    if (!fieldProperties.defaultValue || fieldProperties.defaultValue.trim() === '') {
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
      <a-time-picker
        vModel={fieldProperties.defaultValue}
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        open={this.isOpen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format || 'HH:mm:ss'}
        valueFormat={componentProperties.format || 'HH:mm:ss'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledHours={this.disabledHoursFun}
        disabledMinutes={this.disabledMinutesFun}
        disabledSeconds={this.disabledSecondsFun}
        hideDisabledOptions={componentProperties.hideDisabledOptions}
        use12Hours={componentProperties.use12Hours}
        hourStep={componentProperties.hourStep}
        minuteStep={componentProperties.minuteStep}
        secondStep={componentProperties.secondStep}
        scopedSlots={{
          addon: () => {
            return (
              <a-row type="flex" justify="space-between">
                <a-col>
                  {componentProperties.showNow && (
                    <a-button
                      type="link"
                      size="small"
                      onClick={() => {
                        fieldProperties.defaultValue = moment().format(
                          componentProperties.format || 'HH:mm:ss',
                        );
                        this.isOpen = false;
                      }}
                    >
                      此刻
                    </a-button>
                  )}
                </a-col>
                <a-col>
                  <a-button
                    size="small"
                    type="primary"
                    disabled={!fieldProperties.defaultValue}
                    onClick={() => (this.isOpen = false)}
                  >
                    确定
                  </a-button>
                </a-col>
              </a-row>
            );
          },
        }}
        onOpenChange={(open: boolean) => {
          this.isOpen = open;
        }}
      />
    );
  }
}
