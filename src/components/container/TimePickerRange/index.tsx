import { Vue, Component, Watch, Model, Emit, Prop } from 'vue-property-decorator';
import dayjs from 'dayjs';
import './index.less';

@Component
export default class TimePickerRange extends Vue {
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
   * 展示的时间格式
   */
  @Prop({
    type: String,
    default: 'HH:mm:ss',
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
   * 大小
   */
  @Prop({
    type: String,
    default: 'default',
  })
  size!: string;

  private open1 = false; // 开始时间选择框是否打开
  private open2 = false; // 结束时间选择框是否打开

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
  protected valueChange() {
    this.begin = this.value[0];
    this.end = this.value[1];
  }

  render() {
    return (
      <div class={{ 'component-time-picker-range': true, disabled: this.disabled }}>
        <a-time-picker
          placeholder={this.placeholder[0]}
          open={this.open1}
          allowClear={false}
          ref="picker1"
          format={this.format}
          vModel={this.begin}
          hourStep={this.hourStep}
          minuteStep={this.minuteStep}
          inputReadOnly={this.inputReadOnly}
          secondStep={this.secondStep}
          valueFormat={this.format}
          disabled={this.disabled}
          size={this.size}
          onOpenChange={(state: boolean) => {
            this.open1 = state;
            if (!state) {
              if ((this.end && !this.begin) || (!this.end && this.begin)) {
                this.begin = this.end = null;
              }

              this.handleValueBlur();

              this.status1 = this.status2 = false;
            }
          }}
        >
          <a-button
            slot="addon"
            size="small"
            type="primary"
            disabled={this.beginDisabled}
            onClick={() => {
              this.open1 = false;
              this.status1 = true;

              if (!this.status2) {
                this.open2 = true;
              } else {
                this.status1 = this.status2 = false;

                if (dayjs(`2018-06-01 ${this.end}`).isBefore(dayjs(`2018-06-01 ${this.begin}`))) {
                  this.begin = [this.end, (this.end = this.begin)][0];
                }

                this.handleValueChange([this.begin, this.end]);
                this.handleValueBlur();
              }
            }}
          >
            确定
          </a-button>
        </a-time-picker>

        <span class="separator"> ~ </span>

        <a-time-picker
          placeholder={this.placeholder[1]}
          open={this.open2}
          allowClear={this.allowClear}
          ref="picker2"
          format={this.format}
          valueFormat={this.format}
          hourStep={this.hourStep}
          minuteStep={this.minuteStep}
          secondStep={this.secondStep}
          vModel={this.end}
          inputReadOnly={this.inputReadOnly}
          disabled={this.disabled}
          size={this.size}
          onOpenChange={(state: boolean) => {
            this.open2 = state;
            if (!state) {
              if ((this.end && !this.begin) || (!this.end && this.begin)) {
                this.begin = this.end = null;
              }

              this.handleValueBlur();

              this.status1 = this.status2 = false;
            }
          }}
        >
          <a-button
            slot="addon"
            size="small"
            type="primary"
            disabled={this.endDisabled}
            onClick={() => {
              this.open2 = false;
              this.status2 = true;

              if (!this.status1) {
                this.open1 = true;
              } else {
                this.status1 = this.status2 = false;

                if (dayjs(`2018-06-01 ${this.end}`).isBefore(dayjs(`2018-06-01 ${this.begin}`))) {
                  this.begin = [this.end, (this.end = this.begin)][0];
                }

                this.handleValueChange([this.begin, this.end]);
                this.handleValueBlur();
              }
            }}
          >
            确定
          </a-button>
        </a-time-picker>
      </div>
    );
  }
}
