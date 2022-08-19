import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import { executeStr } from '../../../../utils/format';

@Component
export default class DatePicker extends Mixins(mixin) {
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

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.currentConfig.fieldProperties;

    if (this.directModels[fieldProperties.name].trim() === '') {
      return 'N/A';
    }

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, this.directModels[fieldProperties.name]);
      } catch (e) {
        this.$message.error((e as any).message);
        return 'N/A';
      }
    }

    return this.directModels[fieldProperties.name];
  }

  created() {
    const fieldProperties = this.currentConfig.fieldProperties;

    // 初始化响应式数据模型
    if (!this.directModels[fieldProperties.name]) {
      this.$set(this.directModels, fieldProperties.name, defaultValueGenerator(this.currentConfig));
    }
  }

  // 缓存并校验禁用日期函数
  get disabledDateFun() {
    try {
      if (this.currentConfig.componentProperties.disabledDate.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.currentConfig.componentProperties.disabledDate + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  // 缓存并校验禁用时间函数
  get disabledTimeFun() {
    try {
      if (this.currentConfig.componentProperties.disabledTime.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.currentConfig.componentProperties.disabledTime + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  // 是否显示年选择框
  private isOpen = false;

  render() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const componentProperties = this.currentConfig.componentProperties;
    const formConfig = this.config.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    const time = (
      <a-date-picker
        mode="time"
        style="width: 100%"
        vModel={this.directModels[fieldProperties.name]}
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
      >
        <a-icon slot="suffixIcon" type="clock-circle" />
      </a-date-picker>
    );

    const date = (
      <a-date-picker
        vModel={this.directModels[fieldProperties.name]}
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

    const week = (
      <a-week-picker
        style="width: 100%"
        vModel={this.directModels[fieldProperties.name]}
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
      >
        <a-icon slot="suffixIcon" type="calendar" />
      </a-week-picker>
    );

    const month = (
      <a-month-picker
        style="width: 100%"
        vModel={this.directModels[fieldProperties.name]}
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
        open={this.isOpen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format="YYYY"
        valueFormat="YYYY"
        vModel={this.directModels[fieldProperties.name]}
        showTime={componentProperties.showTime}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
        onOpenChange={(status: boolean) => {
          this.isOpen = status;
        }}
        onPanelChange={(value: any) => {
          this.isOpen = false;
          this.directModels[fieldProperties.name] = value.format('YYYY');
        }}
        onChange={(value: any) => {
          this.directModels[fieldProperties.name] = value;

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
        open={this.isOpen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format="YYYY-YYYY"
        valueFormat="YYYY-YYYY"
        vModel={this.directModels[fieldProperties.name]}
        showTime={componentProperties.showTime}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
        onOpenChange={(status: boolean) => {
          this.isOpen = status;
        }}
        onPanelChange={(value: any) => {
          this.isOpen = false;
          this.directModels[fieldProperties.name] = `${value.format('YYYY')}-${value
            .add(9, 'year')
            .format('YYYY')}`;
        }}
        onChange={(value: any) => {
          this.directModels[fieldProperties.name] = value;

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
