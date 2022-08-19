import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SwitchType from '../../../../SwitchType';
import { getExecStrs } from '../../../../../utils/format';

@Component
export default class Select extends Vue {
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

  // customStyle 转换的列表数据
  private classList: string[] = getExecStrs(this.data.config.customStyle);

  // 监听表单自定义样式的变化，进而给当前组件选择自定义classname
  @Watch('data.config.customStyle')
  private customStyleChangeHandle(newVal: string) {
    this.classList = getExecStrs(newVal);
  }

  // 缓存组件属性配置
  get decoratorProperties() {
    return this.select.decoratorProperties;
  }

  render() {
    return (
      <a-form-model
        props={{ model: this.decoratorProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item label="提示">
          <a-input vModel={this.decoratorProperties.tooltip} placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="提示国际化标识">
          <a-input vModel={this.decoratorProperties.tooltipLangKey} placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="只在布局方式为'水平'时可用，默认继承表单配置中的标签栅格宽度"
                >
                  标签栅格宽度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            placeholder="请输入"
            vModel={this.decoratorProperties.labelCol}
            min={0}
            max={24}
          />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="只在布局方式为'水平'时可用，默认继承表单配置中的组件栅格宽度"
                >
                  组件栅格宽度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            placeholder="请输入"
            vModel={this.decoratorProperties.wrapperCol}
            min={0}
            max={24}
          />
        </a-form-model-item>

        <a-form-model-item label="标签宽度">
          <SwitchType
            value={this.decoratorProperties.labelWidth}
            onChange={(value: string) => {
              this.decoratorProperties.labelWidth = value;
            }}
          />
        </a-form-model-item>
        <a-form-model-item label="组件宽度">
          <SwitchType
            value={this.decoratorProperties.wrapperWidth}
            onChange={(value: string) => {
              this.decoratorProperties.wrapperWidth = value;
            }}
          />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="默认继承表单配置中的标签对齐方式">
                  标签对齐方式
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.decoratorProperties.labelAlign} placeholder="请选择" allowClear>
            <a-select-option value="left">左对齐</a-select-option>
            <a-select-option value="right">右对齐</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="默认继承表单配置中的组件对齐方式">
                  组件对齐方式
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.decoratorProperties.wrapperAlign} placeholder="请选择" allowClear>
            <a-select-option value="left">左对齐</a-select-option>
            <a-select-option value="right">右对齐</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="是否隐藏标签"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.decoratorProperties.hideLabel} />
        </a-form-model-item>
        <a-form-model-item
          label="是否有冒号"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.decoratorProperties.colon} />
        </a-form-model-item>
        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="是否有星号：如果启用必填，此设置无效">
                  是否有星号
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.decoratorProperties.asterisk} />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="数据来源于表单配置中自定义style中的样式名">
                  自定义类名
                </a-tooltip>
              );
            },
          }}
        >
          <a-select
            mode="tags"
            vModel={this.decoratorProperties.customClass}
            placeholder="请选择"
            allowClear
          >
            {this.classList.map((item, index) => {
              return (
                <a-select-option key={(index + 9).toString(36) + index} value={item}>
                  {item}
                </a-select-option>
              );
            })}
          </a-select>
        </a-form-model-item>
      </a-form-model>
    );
  }
}
