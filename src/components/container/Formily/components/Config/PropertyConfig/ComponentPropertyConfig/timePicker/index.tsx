import { Component, Prop, Vue } from 'vue-property-decorator';
import CustomEditor from '../../../../CustomEditor';

@Component
export default class TimePicker extends Vue {
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

  // 是否显示禁止小时气泡框
  private disabledHoursVisible = false;
  // 是否显示禁止分钟气泡框
  private disabledMinutesVisible = false;
  // 是否显示禁止秒气泡框
  private disabledSecondsVisible = false;

  $refs!: {
    disabledhours: CustomEditor;
    disabledminutes: CustomEditor;
    disabledseconds: CustomEditor;
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

        <a-form-model-item label="清除提示">
          <a-input vModel={this.componentProperties.clearText} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="清除提示国际化标识">
          <a-input vModel={this.componentProperties.clearTextLangKey} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="禁止小时：禁止选择部分小时选项，格式 () => number[]"
                >
                  禁止小时
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.disabledHoursVisible}
            onVisibleChange={(visible: boolean) => {
              this.disabledHoursVisible = visible;
              if (!visible) {
                this.componentProperties.disabledHours = this.$refs.disabledhours.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="disabledhours"
                      value={this.componentProperties.disabledHours}
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
                  title="禁止分钟：禁止选择部分分钟选项，格式 (selectedHour: number) => number[]"
                >
                  禁止分钟
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.disabledMinutesVisible}
            onVisibleChange={(visible: boolean) => {
              this.disabledMinutesVisible = visible;
              if (!visible) {
                this.componentProperties.disabledMinutes = this.$refs.disabledminutes.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="disabledminutes"
                      value={this.componentProperties.disabledMinutes}
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
                  title="禁止秒：禁止选择部分秒选项，格式 (selectedHour: number, selectedMinute: number) => number[]"
                >
                  禁止秒
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.disabledSecondsVisible}
            onVisibleChange={(visible: boolean) => {
              this.disabledSecondsVisible = visible;
              if (!visible) {
                this.componentProperties.disabledSeconds = this.$refs.disabledseconds.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="disabledseconds"
                      value={this.componentProperties.disabledSeconds}
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
          label="隐藏禁止选项"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.hideDisabledOptions} />
        </a-form-model-item>

        <a-form-model-item
          label="输入框只读"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.inputReadOnly} />
        </a-form-model-item>

        <a-form-model-item
          label="显示此刻"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.showNow} />
        </a-form-model-item>

        <a-form-model-item
          label="12小时制"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.use12Hours} />
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
                          展示的时间格式，默认值为HH:mm:ss，使用12小时制时，默认值为h:mm:ss
                          a，可参考：
                          <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">
                            moment.js
                          </a>
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
          <a-input vModel={this.componentProperties.format} placeholder="请输入" />
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
