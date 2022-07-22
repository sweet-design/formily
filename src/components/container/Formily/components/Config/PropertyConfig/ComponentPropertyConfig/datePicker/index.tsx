import { Component, Prop, Vue } from 'vue-property-decorator';
import CustomEditor from '../../../../CustomEditor';

@Component
export default class DatePicker extends Vue {
  /**
   * 所有配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  /**
   * 当前选中的组件配置数据模型
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  // 缓存组件属性配置
  get componentProperties() {
    return this.select.componentProperties;
  }

  // 是否显示不可选择日期气泡框
  private disabledDateVisible = false;
  // 是否显示不可选择时间气泡框
  private disabledTimeVisible = false;

  $refs!: {
    disableddate: CustomEditor;
    disabledtime: CustomEditor;
  };

  render() {
    return (
      <a-form-model
        props={{ model: this.componentProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="选择器类型：当选择时间类型时，请开启时间选择">
                  选择器类型
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.picker} placeholder="请选择">
            <a-select-option value="time">时间</a-select-option>
            <a-select-option value="date">日期</a-select-option>
            <a-select-option value="week">周</a-select-option>
            <a-select-option value="month">月份</a-select-option>
            <a-select-option value="year">年</a-select-option>
            <a-select-option value="decade">财年</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          label="允许清除内容"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.allowClear} />
        </a-form-model-item>

        <a-form-model-item
          label="自动获取焦点"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.autoFocus} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="不可选择时间：格式 (currentDate: moment) => boolean"
                >
                  不可选择时间
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.disabledTimeVisible}
            onVisibleChange={(visible: boolean) => {
              this.disabledTimeVisible = visible;
              if (!visible) {
                this.componentProperties.disabledTime = this.$refs.disabledtime.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="disabledtime"
                      value={this.componentProperties.disabledTime}
                      lang="javascript"
                    ></CustomEditor>
                  </div>
                );
              },
            }}
          >
            <a-button block>表达式</a-button>
          </a-popover>
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="不可选择日期：格式 (currentDate: moment) => boolean"
                >
                  不可选择日期
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.disabledDateVisible}
            onVisibleChange={(visible: boolean) => {
              this.disabledDateVisible = visible;
              if (!visible) {
                this.componentProperties.disabledDate = this.$refs.disableddate.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="disableddate"
                      value={this.componentProperties.disabledDate}
                      lang="javascript"
                    ></CustomEditor>
                  </div>
                );
              },
            }}
          >
            <a-button block>表达式</a-button>
          </a-popover>
        </a-form-model-item>

        <a-form-model-item label="占位提示">
          <a-input vModel={this.componentProperties.placeholder} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="占位提示国际化标识">
          <a-input vModel={this.componentProperties.placeholderLangKey} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="配置控件大小，默认继承表单配置中的尺寸设置">
                  尺寸
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.size} placeholder="请选择" allowClear>
            <a-select-option value="large">大</a-select-option>
            <a-select-option value="default">默认</a-select-option>
            <a-select-option value="small">小</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  scopedSlots={{
                    title: () => {
                      return (
                        <span>
                          <span>
                            回填到选择框中的显示格式和数据格式，请正确设置格式，配置参考：
                          </span>
                          <a href="https://momentjs.com/" target="_blank">
                            moment.js
                          </a>
                          ，
                          <span>
                            如果为空字符串，显示格式默认为YYYY-MM-DD，数据格式默认为moment对象，一般情况下日期类型为YYYY-MM-DD，时间类型为HH:mm:ss，月份类型为YYYY-MM，注意：年和财年格式已内置好，不支持自定义
                          </span>
                        </span>
                      );
                    },
                  }}
                >
                  格式
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.format} placeholder="YYYY-MM-DD" />
        </a-form-model-item>

        <a-form-model-item
          label="输入框只读"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.inputReadOnly} />
        </a-form-model-item>

        <a-form-model-item
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="在选择器类型为时间或者日期时，请开启此选项">
                  时间选择
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.showTime} />
        </a-form-model-item>

        <a-form-model-item label="小时间隔">
          <a-input-number vModel={this.componentProperties.hourStep} min={1} style="width: 100%" />
        </a-form-model-item>

        <a-form-model-item label="分钟间隔">
          <a-input-number
            vModel={this.componentProperties.minuteStep}
            min={1}
            style="width: 100%"
          />
        </a-form-model-item>

        <a-form-model-item label="秒间隔">
          <a-input-number
            vModel={this.componentProperties.secondStep}
            min={1}
            style="width: 100%"
          />
        </a-form-model-item>

        <a-form-model-item label="时间格式">
          <a-input vModel={this.componentProperties.timeFormat} />
        </a-form-model-item>

        <a-form-model-item
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
          label="显示今天/此刻"
        >
          <a-switch vModel={this.componentProperties.showToday} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="改值动作：值变化后所执行的动作，选择的数据来自表单配置中的动作响应中心数据，如若已选择的数据在动作响应中心被删除，此处不会自动更新选中值，请主动删除"
                >
                  改值动作
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.onChange} placeholder="请选择" allowClear>
            {this.data.config.actions.map((item: any) => {
              return <a-select-option value={item.key}>{item.name}</a-select-option>;
            })}
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="获取焦点动作：值变化后所执行的动作，选择的数据来自表单配置中的动作响应中心数据，如若已选择的数据在动作响应中心被删除，此处不会自动更新选中值，请主动删除"
                >
                  获取焦点动作
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.onFocus} placeholder="请选择" allowClear>
            {this.data.config.actions.map((item: any) => {
              return <a-select-option value={item.key}>{item.name}</a-select-option>;
            })}
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="失去焦点动作：值变化后所执行的动作，选择的数据来自表单配置中的动作响应中心数据，如若已选择的数据在动作响应中心被删除，此处不会自动更新选中值，请主动删除"
                >
                  失去焦点动作
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.onBlur} placeholder="请选择" allowClear>
            {this.data.config.actions.map((item: any) => {
              return <a-select-option value={item.key}>{item.name}</a-select-option>;
            })}
          </a-select>
        </a-form-model-item>
      </a-form-model>
    );
  }
}
