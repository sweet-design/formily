import { Component, Prop, Vue } from 'vue-property-decorator';
import CustomEditor from '../../../../CustomEditor';

@Component
export default class Number extends Vue {
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

  // 格式转换器显示状态
  private formatConvertVisible = false;

  // 格式解析器显示状态
  private formatAnalysisVisible = false;

  $refs!: {
    expression: CustomEditor;
    formatter: CustomEditor;
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
          label="尺寸"
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
        <a-form-model-item label="小数点符号">
          <a-input vModel={this.componentProperties.decimalSeparator} placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="小数点保留的位数，默认向下取整">
                  数值精度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.precision}
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item label="最大值">
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.max}
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item label="最小值">
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.min}
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="步长：如果为空，默认为 1">
                  步长
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.step}
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip title="指定输入框展示值的格式，格式: (value: number | string) => string">
                  格式转换器
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.formatConvertVisible}
            onVisibleChange={(visible: boolean) => {
              this.formatConvertVisible = visible;
              if (!visible) {
                this.componentProperties.formatter = this.$refs.formatter.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="formatter"
                      value={this.componentProperties.formatter}
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
                <a-tooltip title="指定从 格式转换器 里转换回数字的方式，和 格式转换器 搭配使用,(string) => number">
                  格式解析器
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            visible={this.formatAnalysisVisible}
            onVisibleChange={(visible: boolean) => {
              this.formatAnalysisVisible = visible;
              if (!visible) {
                this.componentProperties.parser = this.$refs.expression.getValue();
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 300px">
                    <CustomEditor
                      height="200"
                      theme="chrome"
                      ref="expression"
                      value={this.componentProperties.parser}
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
