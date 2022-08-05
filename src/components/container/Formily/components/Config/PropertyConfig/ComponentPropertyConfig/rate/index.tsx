import { Component, Prop, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

@Component
export default class Rate extends Vue {
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

  // 校验规则折叠箭头角度
  private rotate = 0;

  render() {
    return (
      <a-form-model
        props={{ model: this.componentProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item
          label="是否允许半选"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.allowHalf} />
        </a-form-model-item>
        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="是否允许再次点击后清除">
                  允许清除内容
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.allowClear} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="自定义每项的提示信息，提示信息会按照排序进行提示"
                >
                  <span
                    class="property-config-wrapper__check-rule"
                    onClick={() => {
                      this.rotate = this.rotate === 0 ? 90 : 0;
                    }}
                  >
                    <a-icon
                      type="right"
                      class="property-config-wrapper__check-rule-icon"
                      rotate={this.rotate}
                    />
                    <span>提示信息</span>
                  </span>
                </a-tooltip>
              );
            },
          }}
        >
          <a-button
            block
            onClick={() => {
              this.componentProperties.tooltips.splice(0);
            }}
          >
            清空
          </a-button>
        </a-form-model-item>

        <div
          v-show={this.rotate === 90}
          class="property-config-wrapper__check-rule-advance"
          style="margin-bottom: 10px"
        >
          <Draggable
            vModel={this.componentProperties.tooltips}
            ghostClass="ghost"
            animation={200}
            handle=".drag-handle"
            move={(e: any) => {
              return true;
            }}
          >
            <transition-group name="fade" tag="div">
              {this.componentProperties.tooltips.map((item: any, index: number) => {
                return (
                  <div class="property-config-wrapper__check-rule-advance-item" key={index}>
                    <a-row type="flex" justify="center" align="middle">
                      <a-col span={3}>
                        <a-icon type="menu" style="cursor: move" class="drag-handle" />
                      </a-col>
                      <a-col span={8}>
                        <a-input vModel={item.tips} placeholder="tips" />
                      </a-col>
                      <a-col span={1}></a-col>
                      <a-col span={9}>
                        <a-input vModel={item.tipsLangKey} placeholder="tipsLangKey" />
                      </a-col>
                      <a-col span={3}>
                        <a-icon
                          type="delete"
                          onClick={() => {
                            this.componentProperties.tooltips.splice(index, 1);
                          }}
                        />
                      </a-col>
                    </a-row>
                  </div>
                );
              })}
            </transition-group>
          </Draggable>
          <a-button
            type="dashed"
            block
            icon="plus"
            onClick={() => {
              this.componentProperties.tooltips.push({
                tips: '',
                tipsLangKey: '',
              });
            }}
          >
            添加
          </a-button>
        </div>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="star 总数">
                  总数
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number style="width: 100%" vModel={this.componentProperties.count} />
        </a-form-model-item>
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
