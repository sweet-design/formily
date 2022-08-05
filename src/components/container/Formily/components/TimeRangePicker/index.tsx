import { Vue, Component, Watch, Model, Emit, Prop } from 'vue-property-decorator';
import dayjs from 'dayjs';
import './index.less';

@Component
export default class TimeRangePicker extends Vue {
  @Model('change', { type: Array, default: () => [] }) value!: Array<string>;

  /**
   * 是否显示清除图标
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  allowClear!: boolean;

  /**
   * 自动获取焦点
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  autoFocus!: boolean;

  /**
   * 展示的时间格式
   */
  @Prop({
    type: String,
    default: '',
  })
  format!: string;

  /**
   * 小时选项间隔
   */
  @Prop({
    type: Number,
    default: 1,
  })
  hourStep!: number;

  /**
   * 分钟选项间隔
   */
  @Prop({
    type: Number,
    default: 1,
  })
  minuteStep!: number;

  /**
   * 秒选项间隔
   */
  @Prop({
    type: Number,
    default: 1,
  })
  secondStep!: number;

  /**
   * 输入框提示文字
   */
  @Prop({
    type: Array,
    default: ['请选择时间', '请选择时间'],
  })
  placeholder!: Array<string>;

  /**
   * 设置输入框为只读
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  inputReadOnly!: boolean;

  /**
   * 禁用全部操作
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;

  /**
   * 禁止选择部分小时选项
   */
  @Prop({
    type: Function,
  })
  disabledHours!: undefined | Function;

  /**
   * 禁止选择部分分钟选项
   */
  @Prop({
    type: Function,
  })
  disabledMinutes!: undefined | Function;

  /**
   * 禁止选择部分秒选项
   */
  @Prop({
    type: Function,
  })
  disabledSeconds!: undefined | Function;

  /**
   * 隐藏禁止选择的选项
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  hideDisabledOptions!: boolean;

  /**
   * 使用 12 小时制，为 true 时 format 默认为 h:mm:ss a
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  use12Hours!: boolean;

  /**
   * 是否显示此刻按钮
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  showNow!: boolean;

  /**
   * 大小
   */
  @Prop({
    type: String,
    default: 'default',
  })
  size!: string;

  private openStart = false; // 开始时间选择框是否打开
  private openEnd = false; // 结束时间选择框是否打开

  private begin: any = null; // 开始时间
  private end: any = null; // 结束时间

  get beginDisabled() {
    return this.begin == null ? true : false;
  }

  get endDisabled() {
    return this.end == null ? true : false;
  }

  private status1 = false; // 开始时间是否已经在当前一轮次选择过
  private status2 = false; // 结束时间是否已经在当前一轮次选择过

  @Watch('end')
  private handleChange(value: any) {
    if (!value) {
      this.begin = null;
      this.handleValueChange([]);
    }
  }

  @Emit('change')
  protected handleValueChange(value: any[]) {}

  @Emit('blur')
  protected handleValueBlur() {}

  @Watch('value', { deep: true, immediate: true })
  protected valueChange(value: any) {
    if (value == null) {
      this.begin = this.end = null;
    } else {
      this.begin = this.value[0];
      this.end = this.value[1];
    }
  }

  private startOk() {
    this.openStart = false;
    this.status1 = true;

    if (!this.status2) {
      this.openEnd = true;
    } else {
      this.status1 = this.status2 = false;

      if (dayjs(`2018-06-01 ${this.end}`).isBefore(dayjs(`2018-06-01 ${this.begin}`))) {
        this.begin = [this.end, (this.end = this.begin)][0];
      }

      this.handleValueChange([this.begin, this.end]);
      this.handleValueBlur();
    }
  }

  private endOk() {
    this.openEnd = false;
    this.status2 = true;

    if (!this.status1) {
      this.openStart = true;
    } else {
      this.status1 = this.status2 = false;

      if (dayjs(`2018-06-01 ${this.end}`).isBefore(dayjs(`2018-06-01 ${this.begin}`))) {
        this.begin = [this.end, (this.end = this.begin)][0];
      }

      this.handleValueChange([this.begin, this.end]);
      this.handleValueBlur();
    }
  }

  render() {
    return (
      <div class={{ 'component-time-range-picker': true, disabled: this.disabled }}>
        <a-time-picker
          placeholder={this.placeholder[0]}
          open={this.openStart}
          allowClear={false}
          autoFocus={this.autoFocus}
          format={this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss')}
          vModel={this.begin}
          disabledHours={this.disabledHours}
          disabledMinutes={this.disabledMinutes}
          disabledSeconds={this.disabledSeconds}
          hourStep={this.hourStep}
          minuteStep={this.minuteStep}
          use12Hours={this.use12Hours}
          inputReadOnly={this.inputReadOnly}
          secondStep={this.secondStep}
          hideDisabledOptions={this.hideDisabledOptions}
          valueFormat={this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss')}
          disabled={this.disabled}
          size={this.size}
          onOpenChange={(state: boolean) => {
            this.openStart = state;

            if (!state) {
              if ((this.end && !this.begin) || (!this.end && this.begin)) {
                this.begin = this.end = null;
              }

              this.handleValueBlur();

              this.status1 = this.status2 = false;
            }
          }}
          scopedSlots={{
            addon: () => {
              return (
                <a-row type="flex" justify="space-between">
                  <a-col>
                    {this.showNow && (
                      <a-button
                        type="link"
                        size="small"
                        onClick={() => {
                          this.begin = dayjs().format(
                            this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'),
                          );
                          this.startOk();
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
                      disabled={this.beginDisabled}
                      onClick={() => {
                        this.startOk();
                      }}
                    >
                      确定
                    </a-button>
                  </a-col>
                </a-row>
              );
            },
            suffixIcon: () => {
              return <a-icon type="xxx" />;
            },
          }}
        />
        <span class="separator"> ~ </span>
        <a-time-picker
          placeholder={this.placeholder[1]}
          open={this.openEnd}
          allowClear={this.allowClear}
          format={this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss')}
          valueFormat={this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss')}
          use12Hours={this.use12Hours}
          hourStep={this.hourStep}
          minuteStep={this.minuteStep}
          secondStep={this.secondStep}
          hideDisabledOptions={this.hideDisabledOptions}
          disabledHours={this.disabledHours}
          disabledMinutes={this.disabledMinutes}
          disabledSeconds={this.disabledSeconds}
          vModel={this.end}
          inputReadOnly={this.inputReadOnly}
          disabled={this.disabled}
          size={this.size}
          onOpenChange={(state: boolean) => {
            this.openEnd = state;
            if (!state) {
              if ((this.end && !this.begin) || (!this.end && this.begin)) {
                this.begin = this.end = null;
              }

              this.handleValueBlur();

              this.status1 = this.status2 = false;
            }
          }}
          scopedSlots={{
            addon: () => {
              return (
                <a-row type="flex" justify="space-between">
                  <a-col>
                    {this.showNow && (
                      <a-button
                        type="link"
                        size="small"
                        onClick={() => {
                          this.end = dayjs().format(
                            this.format || (this.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'),
                          );
                          this.endOk();
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
                      disabled={this.endDisabled}
                      onClick={() => {
                        this.endOk();
                      }}
                    >
                      确定
                    </a-button>
                  </a-col>
                </a-row>
              );
            },
          }}
        />
      </div>
    );
  }
}
