import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import './index.less';

@Component
export default class DateRangePicker extends Mixins(mixin) {
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

    if (fieldProperties.defaultValue == null || fieldProperties.defaultValue.length === 0) {
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

  // 缓存并校验禁用日期函数
  get disabledDateFun() {
    try {
      if (this.config.componentProperties.disabledDate.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledDate + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  // 缓存并校验禁用时间函数
  get disabledTimeFun() {
    try {
      if (this.config.componentProperties.disabledTime.trim() === '') {
        return undefined;
      }

      return Function(
        '"use strict";return (' + this.config.componentProperties.disabledTime + ')',
      )();
    } catch (e) {
      this.$message.error('禁用时间代码校验错误，请修改正确或者清空');
      return undefined;
    }
  }

  private startDisabled() {
    this.$nextTick(() => {
      const table = document.getElementsByClassName('ant-calendar-year-panel-tbody');
      // 所有开始年份
      const startList = table[0].querySelectorAll('td');
      startList.forEach((item: any) => {
        if (item.innerText > this.end) {
          item.setAttribute('class', 'year-disabled');
        } else {
          item.classList.remove('year-disabled');
        }
      });
    });
  }

  private endDisabled() {
    this.$nextTick(() => {
      const table = document.getElementsByClassName('ant-calendar-year-panel-tbody');
      // 所有结束年份
      const endList = table[1].querySelectorAll('td');
      endList.forEach((item: any) => {
        if (item.innerText < this.start) {
          item.setAttribute('class', 'year-disabled');
        } else {
          item.classList.remove('year-disabled');
        }
      });
    });
  }

  private yearPanelPageChange() {
    this.$nextTick(() => {
      const nextBtn = document.querySelectorAll('.ant-calendar-year-panel-next-decade-btn');
      const prevBtn = document.querySelectorAll('.ant-calendar-year-panel-prev-decade-btn');
      const that = this;
      function addClick(domList: any) {
        domList.forEach((dom: any) => {
          dom.onclick = () => {
            that.openChange();
          };
        });
      }
      addClick(nextBtn);
      addClick(prevBtn);
    });
  }

  private openChange() {
    setTimeout(() => {
      this.endDisabled();
      this.startDisabled();
    });

    this.yearPanelPageChange();
  }

  // 是否显示年选择框
  private isOpen = false;

  // 显示模式
  private mode = ['month', 'month'];

  private start = 0;
  private end = 0;

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    const time = (
      <a-range-picker
        mode={['time', 'time']}
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
        format={
          componentProperties.format ||
          (componentProperties.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
        }
        valueFormat={
          componentProperties.format ||
          (componentProperties.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
        }
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
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
      >
        <a-icon slot="suffixIcon" type="clock-circle" />
      </a-range-picker>
    );

    const date = (
      <a-range-picker
        vModel={fieldProperties.defaultValue}
        style="width: 100%"
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
        format={
          componentProperties.format ||
          (componentProperties.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
        }
        valueFormat={
          componentProperties.format ||
          (componentProperties.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
        }
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
        disabledDate={this.disabledDateFun}
        disabledTime={this.disabledTimeFun}
      >
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
    );

    const month = (
      <a-range-picker
        mode={this.mode}
        style="width: 100%"
        value={fieldProperties.defaultValue}
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
        open={this.isOpen}
        size={componentProperties.size ?? formConfig.size}
        inputReadOnly={componentProperties.inputReadOnly}
        format={componentProperties.format || 'YYYY-MM'}
        valueFormat={componentProperties.format || 'YYYY-MM'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        onOpenChange={(status: boolean) => {
          this.isOpen = status;
        }}
        onPanelChange={(value: any[], mode: string[]) => {
          const format = componentProperties.format || 'YYYY-MM';
          fieldProperties.defaultValue = [value[0].format(format), value[1].format(format)];

          if (mode[1] === 'date') {
            this.isOpen = false;
          }

          this.mode = [
            mode[0] === 'date' ? 'month' : mode[0],
            mode[1] === 'date' ? 'month' : mode[1],
          ];
        }}
        onChange={(value: any[]) => {
          fieldProperties.defaultValue = value;
        }}
      >
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
    );

    const year = (
      <a-range-picker
        style="width: 100%"
        mode={['year', 'year']}
        value={fieldProperties.defaultValue}
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
        format={componentProperties.format || 'YYYY'}
        valueFormat={componentProperties.format || 'YYYY'}
        disabled={fieldProperties.pattern === 'disabled'}
        disabledDate={this.disabledDateFun}
        onPanelChange={(value: any) => {
          const format = componentProperties.format || 'YYYY';

          this.start = value[0].format(format);
          this.end = value[1].format(format);

          fieldProperties.defaultValue = [this.start, this.end];

          this.openChange();
        }}
        onChange={(value: any[]) => {
          fieldProperties.defaultValue = value;
        }}
      >
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
    );

    switch (componentProperties.picker) {
      case 'time':
        return time;
      case 'date':
        return date;
      case 'month':
        return month;
      case 'year':
        return year;
    }

    return null;
  }
}
