import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';

@Component
export default class DatePicker extends Mixins(mixin) {
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

    if (fieldProperties.defaultValue.trim() === '') {
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

  // 缓存并校验禁用日期函数
  get disabledDateFun() {
    try {
      if (this.config.componentProperties.disabledDate.trim() === '') {
        return null;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledDate + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return null;
    }
  }

  // 缓存并校验禁用时间函数
  get disabledTimeFun() {
    try {
      if (this.config.componentProperties.disabledTime.trim() === '') {
        return null;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledTime + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return null;
    }
  }

  // 是否显示年选择框
  private isopen = false;

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    const time = (
      <a-date-picker
        mode="time"
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format}
        valueFormat={componentProperties.format || 'HH:mm:ss'}
        showTime={
          componentProperties.showTime
            ? {
                hourStep: componentProperties.hourStep,
                minuteStep: componentProperties.minuteStep,
                secondStep: componentProperties.secondStep,
                format: componentProperties.timeFormat,
              }
            : false
        }
        showToday={componentProperties.showToday}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledTime={this.disabledTimeFun}
      />
    );

    const date = (
      <a-date-picker
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format}
        valueFormat={componentProperties.format || 'YYYY-MM-DD'}
        showTime={
          componentProperties.showTime
            ? {
                hourStep: componentProperties.hourStep,
                minuteStep: componentProperties.minuteStep,
                secondStep: componentProperties.secondStep,
                format: componentProperties.timeFormat,
              }
            : false
        }
        disabled={fieldProperties.pattern === 'disabled'}
        showToday={componentProperties.showToday}
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
      />
    );

    const week = (
      <a-week-picker
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format}
        valueFormat={componentProperties.format || 'YYYY-w'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
      />
    );

    const month = (
      <a-month-picker
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format}
        valueFormat={componentProperties.format || 'YYYY-MM'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
      />
    );

    const year = (
      <a-date-picker
        mode="year"
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        open={this.isopen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format="YYYY"
        valueFormat="YYYY"
        value={fieldProperties.defaultValue}
        showTime={componentProperties.showTime}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
        onOpenChange={(status: boolean) => {
          this.isopen = status;
        }}
        onPanelChange={(value: any) => {
          this.isopen = false;
          fieldProperties.defaultValue = value.format('YYYY');
        }}
        onChange={() => {
          fieldProperties.defaultValue = '';
        }}
      />
    );

    const decade = (
      <a-date-picker
        mode="decade"
        style="width: 100%"
        allowClear={componentProperties.allowClear}
        autoFocus={componentProperties.autoFocus}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        open={this.isopen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format="YYYY-YYYY"
        valueFormat="YYYY-YYYY"
        value={fieldProperties.defaultValue}
        showTime={componentProperties.showTime}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
        onOpenChange={(status: boolean) => {
          this.isopen = status;
        }}
        onPanelChange={(value: any) => {
          this.isopen = false;
          fieldProperties.defaultValue = `${value.format('YYYY')}-${value
            .add(9, 'year')
            .format('YYYY')}`;
        }}
        onChange={() => {
          fieldProperties.defaultValue = '';
        }}
      />
    );

    switch (componentProperties.picker) {
      case 'time':
        return time;
      case 'date':
        return date;
      case 'week':
        return week;
      case 'month':
        return month;
      case 'year':
        return year;
      case 'decade':
        return decade;
    }

    return null;
  }
}
