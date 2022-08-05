import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Switcher extends Vue {
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
          label="自动获取焦点"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.autoFocus} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="选中时内容默认会在阅读模式下展示">
                  选中时内容
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.checkedChildren} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="选中时内容国际化标识">
          <a-input vModel={this.componentProperties.checkedChildrenLangKey} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="非选中时内容默认会在阅读模式下展示">
                  非选中时内容
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.unCheckedChildren} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="非选中时内容国际化标识">
          <a-input
            vModel={this.componentProperties.unCheckedChildrenLangKey}
            placeholder="请输入"
          />
        </a-form-model-item>

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
