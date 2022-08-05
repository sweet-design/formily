import { Component, Prop, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

@Component
export default class Input extends Vue {
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
        <div class="property-config-wrapper__check-rule-advance" style="margin-bottom: 10px">
          <Draggable
            vModel={this.componentProperties.columns}
            ghostClass="ghost"
            animation={200}
            handle=".drag-handle"
            move={(e: any) => {
              return true;
            }}
          >
            <transition-group name="fade" tag="div">
              {this.componentProperties.columns.map((item: any, index: number) => {
                return (
                  <div class="property-config-wrapper__check-rule-advance-item" key={index}>
                    <a-row type="flex" justify="center" align="middle">
                      <a-col span={4}>
                        <a-icon type="menu" style="cursor: move" class="drag-handle" />
                      </a-col>
                      <a-col span={16}>
                        <a-input-number
                          style="width: 100%"
                          placeholder="栅格值"
                          max={24}
                          vModel={item.span}
                        />
                      </a-col>
                      <a-col span={4}>
                        <a-icon
                          type="delete"
                          onClick={() => {
                            this.$confirm({
                              content: '确定删除吗？',
                              onOk: () => {
                                this.componentProperties.columns.splice(index, 1);
                              },
                            });
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
            onClick={() => {
              this.componentProperties.columns.push({ span: null, list: [] });
            }}
            block
          >
            添加选项
          </a-button>
        </div>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="栅格之间的距离，单位px">
                  栅格间隔
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number style="width: 100%" vModel={this.componentProperties.gutter} />
        </a-form-model-item>
        <a-form-model-item label="水平排列方式">
          <a-select vModel={this.componentProperties.justify} placeholder="请选择">
            <a-select-option value="start">左对齐</a-select-option>
            <a-select-option value="end">右对齐</a-select-option>
            <a-select-option value="center">居中对齐</a-select-option>
            <a-select-option value="space-around">两侧间隔相等</a-select-option>
            <a-select-option value="space-between">两端对齐</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="垂直排列方式">
          <a-select vModel={this.componentProperties.align} placeholder="请选择">
            <a-select-option value="top">顶部对齐</a-select-option>
            <a-select-option value="middle">居中对齐</a-select-option>
            <a-select-option value="bottom">底部对齐</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    );
  }
}
