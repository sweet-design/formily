import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { createHash } from '../../../../../utils/format';
import { ColModel, ColConfigModel } from '../../../../../Models/Array/arrayTable';
import ControlCenter from '../../../../ControlCenter';

@Component
export default class ArrayTable extends Vue {
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

  @Watch('select')
  private dataChangeHandle() {
    this.drawerVisible = false;
  }

  // 缓存组件属性配置
  get componentProperties() {
    return this.select.componentProperties;
  }

  // 列配置箭头角度
  private rotate = 0;

  // 是否显示列配置抽屉
  private drawerVisible = false;

  // 当前所在编辑的列配置对象
  private currentColConfig: ColConfigModel & { key: string } = {
    key: '',
    fieldProperties: {
      name: '',
      title: '',
      titleLangKey: '',
      description: '',
      descriptionLangKey: '',
      display: '',
      pattern: '',
      reactions: {
        dependencies: [],
        fulfill: {
          state: {
            required: '',
            pattern: '',
            display: '',
            title: '',
            defaultValue: '',
            value: '',
          },
        },
      },
      isContainerComponent: false,
    },
    componentProperties: {
      title: '',
      titleLangKey: '',
      align: '',
      width: null,
      fixed: '',
      colType: 'data',
      list: [],
    },
  };

  // 当前展开的折叠面板标识列表
  private collapseList = ['field', 'component'];

  // 是否显示受控中心弹窗
  private controlVisible = false;

  render() {
    return (
      <div>
        <a-form-model
          props={{ model: this.componentProperties }}
          label-col={{ span: 9 }}
          wrapper-col={{ span: 14, offset: 1 }}
          labelAlign="left"
        >
          <a-form-model-item
            label="是否有边框"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 9, offset: 1 }}
          >
            <a-switch vModel={this.componentProperties.bordered} />
          </a-form-model-item>

          <a-form-model-item
            label="显示头部"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 9, offset: 1 }}
          >
            <a-switch vModel={this.componentProperties.showHeader} />
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
              <a-select-option value="default">默认</a-select-option>
              <a-select-option value="middle">中等</a-select-option>
              <a-select-option value="small">小</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="表格布局">
            <a-select vModel={this.componentProperties.tableLayout} placeholder="请选择">
              <a-select-option value="auto">自动</a-select-option>
              <a-select-option value="fixed">固定</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip placement="left" title="列配置：自定义每一列组件属性">
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
                      <span>列配置</span>
                    </span>
                  </a-tooltip>
                );
              },
            }}
          >
            <a-button
              block
              onClick={() => {
                this.componentProperties.list.splice(0);
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
              vModel={this.componentProperties.list}
              ghostClass="ghost"
              animation={200}
              handle=".drag-handle"
              move={(e: any) => {
                return true;
              }}
            >
              <transition-group name="fade" tag="div">
                {this.componentProperties.list.map((item: any, index: number) => {
                  return (
                    <div class="property-config-wrapper__check-rule-advance-item" key={index}>
                      <a-row type="flex" justify="center" align="middle">
                        <a-col span={3}>
                          <a-icon type="menu" style="cursor: move" class="drag-handle" />
                        </a-col>
                        <a-col span={12}>
                          <a-button
                            onClick={() => {
                              this.currentColConfig = item;
                              // 需要重置展开项
                              this.collapseList = ['field', 'component'];
                              this.drawerVisible = true;
                            }}
                          >
                            配置列
                          </a-button>
                        </a-col>
                        <a-col span={3}>
                          <a-icon
                            type="up"
                            onClick={() => {
                              const temp = this.componentProperties.list;
                              if (temp.length === 1 || index === 0) return;

                              temp.splice(index - 1, 1, ...temp.splice(index, 1, temp[index - 1]));
                            }}
                          />
                        </a-col>
                        <a-col span={3}>
                          <a-icon
                            type="down"
                            onClick={() => {
                              const temp = this.componentProperties.list;
                              if (temp.length === index + 1) return;
                              temp.splice(index, 1, ...temp.splice(index + 1, 1, temp[index]));
                            }}
                          />
                        </a-col>
                        <a-col span={3}>
                          <a-icon
                            type="delete"
                            onClick={() => {
                              this.componentProperties.list.splice(index, 1);
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
                this.componentProperties.list.push({
                  key: createHash(12),
                  ...JSON.parse(JSON.stringify(ColModel)),
                });
              }}
            >
              添加
            </a-button>
          </div>
        </a-form-model>

        {/* 受控中心配置 */}
        {this.controlVisible && (
          <ControlCenter
            data={this.currentColConfig.fieldProperties.reactions}
            id={this.currentColConfig.key}
            onConfirm={(data: any) => {
              this.currentColConfig.fieldProperties.reactions = data;
              this.controlVisible = false;
            }}
            onCancel={() => {
              this.controlVisible = false;
            }}
          />
        )}

        {/* 列配置抽屉 */}
        <a-drawer
          placement="right"
          closable={false}
          keyboard={false}
          getContainer={() => {
            return document.querySelector('.property-config-wrapper');
          }}
          destroyOnClose
          width="250px"
          bodyStyle={{ padding: '16px 0 20px' }}
          visible={this.drawerVisible}
          mask={false}
          headerStyle={{ padding: '10px 24px' }}
          scopedSlots={{
            title: () => {
              return (
                <span
                  class="property-config-wrapper__close-drawer"
                  onClick={() => {
                    this.drawerVisible = false;
                  }}
                >
                  <a-icon type="rollback" /> 返回
                </span>
              );
            },
          }}
        >
          <div>
            <a-collapse
              vModel={this.collapseList}
              scopedSlots={{
                expandIcon: (props: any) => {
                  return <a-icon type="caret-right" rotate={props.isActive ? 90 : 0} />;
                },
              }}
            >
              <a-collapse-panel key="field" header="字段属性">
                <a-form-model
                  props={{ model: this.currentColConfig.fieldProperties }}
                  label-col={{ span: 9 }}
                  wrapper-col={{ span: 14, offset: 1 }}
                  labelAlign="left"
                >
                  <a-form-model-item
                    label="字段标识"
                    prop="name"
                    key={this.currentColConfig.key}
                    rules={[
                      {
                        required: true,
                        message: '字段标识不能为空',
                      },
                      {
                        pattern: /^[a-z]+$/i,
                        message: '只能使用英文字母',
                      },
                    ]}
                  >
                    <a-input
                      vModel={this.currentColConfig.fieldProperties.name}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="标题">
                    <a-input
                      vModel={this.currentColConfig.fieldProperties.title}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="标题国际化标识">
                    <a-input
                      vModel={this.currentColConfig.fieldProperties.titleLangKey}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="描述">
                    <a-textarea
                      autoSize
                      vModel={this.currentColConfig.fieldProperties.description}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="描述国际化标识">
                    <a-input
                      vModel={this.currentColConfig.fieldProperties.descriptionLangKey}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip placement="left" title="半隐藏只会隐藏UI，全隐藏会删除数据">
                            展示状态
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-select vModel={this.currentColConfig.fieldProperties.display}>
                      <a-select-option value="visible">显示</a-select-option>
                      <a-select-option value="hidden">半隐藏</a-select-option>
                      <a-select-option value="none">全隐藏</a-select-option>
                    </a-select>
                  </a-form-model-item>

                  <a-form-model-item label="UI形态">
                    <a-select vModel={this.currentColConfig.fieldProperties.pattern}>
                      <a-select-option value="editable">可编辑</a-select-option>
                      <a-select-option value="disabled">禁用</a-select-option>
                      <a-select-option value="readOnly">只读</a-select-option>
                      <a-select-option value="readPretty">阅读</a-select-option>
                    </a-select>
                  </a-form-model-item>

                  <a-form-model-item label="受控中心">
                    <a-button
                      block
                      onClick={() => {
                        this.controlVisible = true;
                      }}
                    >
                      受控配置
                    </a-button>
                  </a-form-model-item>

                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="容器组件：开启会将此列字段标识作为对象key进行包装，否者直接使用子级数据"
                          >
                            容器组件
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-switch vModel={this.currentColConfig.fieldProperties.isContainerComponent} />
                  </a-form-model-item>
                </a-form-model>
              </a-collapse-panel>
              <a-collapse-panel key="component" header="组件属性">
                <a-form-model
                  label-col={{ span: 9 }}
                  wrapper-col={{ span: 14, offset: 1 }}
                  labelAlign="left"
                >
                  <a-form-model-item label="标题">
                    <a-input
                      vModel={this.currentColConfig.componentProperties.title}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="标题国际化标识">
                    <a-input
                      vModel={this.currentColConfig.componentProperties.titleLangKey}
                      placeholder="请输入"
                    />
                  </a-form-model-item>

                  <a-form-model-item label="内容对齐">
                    <a-select vModel={this.currentColConfig.componentProperties.align}>
                      <a-select-option value="left">左</a-select-option>
                      <a-select-option value="center">居中</a-select-option>
                      <a-select-option value="right">右</a-select-option>
                    </a-select>
                  </a-form-model-item>

                  <a-form-model-item label="宽度">
                    <a-input-number
                      vModel={this.currentColConfig.componentProperties.width}
                      style="width: 100%"
                    />
                  </a-form-model-item>

                  <a-form-model-item
                    label="固定"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 17, offset: 1 }}
                  >
                    <a-radio-group
                      vModel={this.currentColConfig.componentProperties.fixed}
                      button-style="solid"
                    >
                      <a-radio-button value="left">左</a-radio-button>
                      <a-radio-button value="right">右</a-radio-button>
                      <a-radio-button value={false}>无</a-radio-button>
                    </a-radio-group>
                  </a-form-model-item>
                </a-form-model>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-drawer>
      </div>
    );
  }
}
