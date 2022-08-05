import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Textarea extends Vue {
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
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          label="自适应高度"
        >
          <a-switch vModel={this.componentProperties.autoSize} />
        </a-form-model-item>
        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          label="允许清除内容"
        >
          <a-switch vModel={this.componentProperties.allowClear} />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="输入的字符最大长度">
                  最大长度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number style="width: 100%" vModel={this.componentProperties.maxLength} />
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
