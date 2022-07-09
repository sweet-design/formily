import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SwitchType from '../../SwitchType';
import { getExecStrs } from '../../../utils/format';
import './index.less';

@Component
export default class PropertyConfig extends Vue {
  /**
   * 组件所有配置数据
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

  // 监听表单自定义样式的变化，进而给当前组件选择自定义classname
  @Watch('data.config.customStyle')
  private customStyleChangeHandle(newVal: string) {
    this.classList = getExecStrs(newVal);
  }

  // 组件类型改变需要更新配置组件
  @Watch('select.fieldProperties.type')
  private componentTypeChangeHandle(newVal: string) {
    this.FieldPropertyConfig = () => import(`./FieldPropertyConfig/${newVal}`);
    this.ComponentPropertyConfig = () => import(`./ComponentPropertyConfig/${newVal}`);
  }

  // 计算是否能显示右侧属性配置窗口，如果当前选择的是整个表单，将不能显示属性配置窗口
  get show() {
    if (this.select && !this.select.config && Object.keys(this.select).length > 0) {
      return true;
    }

    return false;
  }

  // customStyle 转换的列表数据
  private classList: string[] = [];

  // 动态导入指定类型字段属性配置
  private FieldPropertyConfig: any = () =>
    import(`./FieldPropertyConfig/${this.select.fieldProperties.type}`);

  // 动态导入指定类型组件属性配置
  private ComponentPropertyConfig: any = () =>
    import(`./ComponentPropertyConfig/${this.select.fieldProperties.type}`);

  render() {
    // 容器属性
    const decoratorProperties = this.show && this.select.decoratorProperties;

    return (
      <div class="property-config-wrapper">
        {this.show && (
          <a-collapse
            default-active-key="1"
            scopedSlots={{
              expandIcon: (props: any) => {
                return <a-icon type="caret-right" rotate={props.isActive ? 90 : 0} />;
              },
            }}
          >
            <a-collapse-panel key="1" header="字段属性">
              {/* 根据组件类型动态加载指定字段属性配置组件 */}
              <this.FieldPropertyConfig select={this.select} data={this.data} />
            </a-collapse-panel>

            <a-collapse-panel key="2" header="组件属性">
              {/* 根据组件类型动态加载指定组件属性配置组件 */}
              <this.ComponentPropertyConfig select={this.select} data={this.data} />
            </a-collapse-panel>

            {/* 布局组件是没有容器属性的 */}
            {decoratorProperties && (
              <a-collapse-panel key="3" header="容器属性">
                <a-form-model
                  props={{ model: decoratorProperties }}
                  label-col={{ span: 9 }}
                  wrapper-col={{ span: 14, offset: 1 }}
                  labelAlign="left"
                >
                  <a-form-model-item label="提示">
                    <a-input vModel={decoratorProperties.tooltip} placeholder="请输入" />
                  </a-form-model-item>
                  <a-form-model-item label="提示国际化标识">
                    <a-input vModel={decoratorProperties.tooltipLangKey} placeholder="请输入" />
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
                      vModel={decoratorProperties.labelCol}
                      min={1}
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
                      vModel={decoratorProperties.wrapperCol}
                      min={1}
                      max={24}
                    />
                  </a-form-model-item>

                  <a-form-model-item label="标签宽度">
                    <SwitchType
                      value={decoratorProperties.labelWidth}
                      onChange={(value: string) => {
                        decoratorProperties.labelWidth = value;
                      }}
                    />
                  </a-form-model-item>
                  <a-form-model-item label="组件宽度">
                    <SwitchType
                      value={decoratorProperties.wrapperWidth}
                      onChange={(value: string) => {
                        decoratorProperties.wrapperWidth = value;
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
                    <a-select
                      vModel={decoratorProperties.labelAlign}
                      placeholder="请选择"
                      allowClear
                    >
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
                    <a-select
                      vModel={decoratorProperties.wrapperAlign}
                      placeholder="请选择"
                      allowClear
                    >
                      <a-select-option value="left">左对齐</a-select-option>
                      <a-select-option value="right">右对齐</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="是否隐藏标签">
                    <a-switch vModel={decoratorProperties.hideLabel} />
                  </a-form-model-item>
                  <a-form-model-item label="是否有冒号">
                    <a-switch vModel={decoratorProperties.colon} />
                  </a-form-model-item>
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="数据来源于表单配置中自定义style中的样式名"
                          >
                            自定义类名
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-select
                      mode="tags"
                      vModel={decoratorProperties.customClass}
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
              </a-collapse-panel>
            )}
          </a-collapse>
        )}
      </div>
    );
  }
}
