import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
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
                <a-tooltip title="自定义字段名：数据映射，此处的字段映射跟数据源数据结构有关，请注意设置">
                  自定义字段名
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 200px">
                    <a-input
                      addon-before="标签值"
                      placeholder="请输入"
                      vModel={this.componentProperties.replaceField.label}
                    />
                    <a-input
                      addon-before="数据值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.componentProperties.replaceField.value}
                    />
                    <a-input
                      addon-before="语言值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.componentProperties.replaceField.lang}
                    />
                  </div>
                );
              },
            }}
          >
            <a-button block>设置</a-button>
          </a-popover>
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
      </a-form-model>
    );
  }
}
