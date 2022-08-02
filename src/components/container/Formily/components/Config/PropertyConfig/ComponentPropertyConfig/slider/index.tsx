import { Component, Prop, Vue } from 'vue-property-decorator';
import DataTypeSwitch from '../../../../DataTypeSwitch';

@Component
export default class Slider extends Vue {
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
          label="刻度固定"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.dots} />
        </a-form-model-item>

        <a-form-model-item
          label="双滑块"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.range} />
        </a-form-model-item>

        <a-form-model-item
          label="反向坐标轴"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.reverse} />
        </a-form-model-item>

        <a-form-model-item
          label="垂直布局"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.vertical} />
        </a-form-model-item>

        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="是否包含：刻度标记 不为空对象时有效，值为 开启 时表示值为包含关系，关闭 表示并列"
                >
                  是否包含
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.included} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="提示显示：值为true时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时。如果不选择，移入时或者在拖拽时会显示，离开将隐藏"
                >
                  提示显示
                </a-tooltip>
              );
            },
          }}
        >
          <a-select
            vModel={this.componentProperties.tooltipVisible}
            placeholder="请选择"
            style="width: 100%"
            allowClear
            options={[
              { label: '显示', value: 'true' },
              { label: '隐藏', value: 'false' },
            ]}
          ></a-select>
        </a-form-model-item>

        <a-form-model-item label="提示位置">
          <a-select
            vModel={this.componentProperties.tooltipPlacement}
            placeholder="请选择"
            allowClear
            options={[
              { label: '左上角', value: 'topLeft' },
              { label: '顶部', value: 'top' },
              { label: '右上角', value: 'topRight' },
              { label: '左顶角', value: 'leftTop' },
              { label: '左边', value: 'left' },
              { label: '左下角', value: 'leftBottom' },
              { label: '右顶角', value: 'rightTop' },
              { label: '右边', value: 'right' },
              { label: '右下角', value: 'rightBottom' },
              { label: '下左角', value: 'bottomLeft' },
              { label: '底部', value: 'bottom' },
              { label: '下右角', value: 'bottomRight' },
            ]}
          ></a-select>
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
                          刻度标记：key 的类型必须为 number 且取值在闭区间 [min, max]
                          内，每个标签可以单独设置样式，数据类型为object，格式：() ={'>'} object
                          可参考：
                          <a
                            href="https://1x.antdv.com/components/slider/#Graduated-slider"
                            target="_blank"
                          >
                            链接
                          </a>
                        </span>
                      );
                    },
                  }}
                >
                  刻度标记
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType="expression"
            values={this.componentProperties.marks}
            types={['expression']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.marks = newType;
              },
              change: (value: string) => {
                this.componentProperties.marks = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="最大值：请不要为空">
                  最大值
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.max}
            min={0}
            onChange={(value: any) => {
              if (value === '') {
                this.componentProperties.max = 0;
              }
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="最小值：请不要为空">
                  最小值
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            vModel={this.componentProperties.min}
            min={0}
            onChange={(value: any) => {
              if (value === '') {
                this.componentProperties.min = 0;
              }
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="步长：取值必须大于 0，并且可被 (最大值 - 最小值) 整除。当 刻度标记 不为空对象时，可以设置 步长 为 null，此时 滑动输入条 的可选值仅有 刻度标记 标出来的部分。"
                >
                  步长
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            style="width: 100%"
            placeholder="请输入"
            vModel={this.componentProperties.step}
          />
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
