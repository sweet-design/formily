import { Vue, Component, Prop, Provide, Model, Watch } from 'vue-property-decorator';
import { inputComponents, layoutComponents, arrayComponents } from './Models';
import { Layout } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import FormConfigModel from './Models/Form/form';
import FormConfig from './components/Config/FormConfig';
import PropertyConfig from './components/Config/PropertyConfig';
import WidgetForm from './components/Designer/WidgetForm';
import { createHash, generateComponentList } from './utils/format';
import CustomEditor from './components/CustomEditor';
import Generator from './components/Generator';
import './index.less';

@Component
export default class FormDesigner extends Vue {
  /**
   * 输入组件
   */
  @Prop({
    type: Array,
    default: () => [
      'input',
      'textarea',
      'password',
      'number',
      'select',
      'radio',
      'checkbox',
      'switcher',
      'datePicker',
      'dateRangePicker',
      'timePicker',
      'timeRangePicker',
      'rate',
      'cascader',
      'treeSelect',
      'slider',
    ],
  })
  inputComps!: Array<string>;

  /**
   * 布局组件
   */
  @Prop({
    type: Array,
    default: () => ['grid'],
  })
  layoutComps!: Array<string>;

  /**
   * 自增组件
   */
  @Prop({
    type: Array,
    default: () => ['arrayTable'],
  })
  arrayComps!: Array<string>;

  /**
   * 是否显示导入JSON按钮
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  upload!: boolean;

  /**
   * 是否显示清空按钮
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  clearable!: boolean;

  /**
   * 是否显示预览按钮
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  preview!: boolean;

  /**
   * 是否显示生成JSON按钮
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  generateJson!: boolean;

  /**
   * 是否显示生成代码按钮
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  generateCode!: boolean;

  /**
   * 默认配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: Record<string, any>;

  @Watch('config')
  private handleValueChange(newVal: any) {
    if (newVal && Object.keys(newVal).length > 0) {
      this.updateConifg(newVal);
    }
  }

  created() {
    if (this.config && Object.keys(this.config).length > 0) {
      this.updateConifg(this.config);
    }
  }

  $refs!: {
    generator: any;
  };

  /**
   * 更新配置信息并默认选中第一个
   * @param data 全量配置数据
   */
  private updateConifg(data: Record<string, any>) {
    this.widgetData = JSON.parse(JSON.stringify(data, null, 2));

    if (this.widgetData.list.length > 0) {
      this.updateWidgetDataSelect(this.widgetData.list[0]);
    }
  }

  /**
   * 注入生成组件树函数
   * @param filterNode 过滤的节点唯一编号
   * @returns 组件目录树结构
   */
  @Provide('generateComponentTree')
  generateTree = (filterNode: string[] = []) => {
    const arr: any[] = [];
    this.generateComponentTree(arr, this.widgetData.list, filterNode);

    return arr;
  };

  /**
   * 注入生成组件列表函数
   * @param filterNode 过滤的节点唯一编号
   * @returns 组件目录树结构
   */
  @Provide('generateComponentList')
  generateList = (filterNode: string[] = []) => {
    return generateComponentList(this.widgetData, filterNode);
  };

  /**
   * 获取表单配置信息
   * @returns 表单配置数据
   */
  getConfigData() {
    return this.widgetData;
  }

  /**
   * 生成组件树
   * @param arr 数据容器
   * @param config 配置结构
   */
  private generateComponentTree(arr: Array<any>, config: any[], filterNode: string[]) {
    config.forEach((item: any) => {
      if (item.fieldProperties.type === 'grid') {
        const temp = {
          value: item.key,
          key: item.key,
          title: item.fieldProperties.title,
          children: [],
        };
        if (!filterNode.includes(item.key)) {
          arr.push(temp);
          this.generateComponentTree(
            temp.children,
            this.extractData(item.componentProperties.columns),
            filterNode,
          );
        }
      } else if (item.fieldProperties.type === 'arrayTable') {
        const temp = {
          value: item.key,
          key: item.key,
          title: item.fieldProperties.title,
          children: [],
        };
        if (!filterNode.includes(item.key)) {
          arr.push(temp);
          this.generateComponentTree(temp.children, item.componentProperties.list, filterNode);
        }
      } else {
        if (!filterNode.includes(item.key)) {
          arr.push({
            value: item.key,
            key: item.key,
            label: item.fieldProperties.title,
            title: item.fieldProperties.title,
          });
        }
      }
    });
  }

  /**
   * 提取grid布局下的字段数据
   * @param data grid 布局下的 columns的数据
   */
  private extractData(data: any[]) {
    const arr: any[] = [];
    data.forEach(item => item.list.forEach((sub: any) => arr.push(sub)));

    return arr;
  }

  // 根据输入组件类别过滤后的输入组件配置
  private inputComponents = inputComponents.filter(item => {
    return this.inputComps.indexOf(item.fieldProperties.type) != -1;
  });

  // 根据布局组件类别过滤后的布局组件配置
  private layoutComponents = layoutComponents.filter(item => {
    return this.layoutComps.indexOf(item.fieldProperties.type) != -1;
  });

  // 根据布局组件类别过滤后的布局组件配置
  private arrayComponents = arrayComponents.filter(item => {
    return this.arrayComps.indexOf(item.fieldProperties.type) != -1;
  });

  // 表单组件所有配置数据
  private widgetData = {
    list: [],
    config: { ...FormConfigModel },
    key: createHash(12),
  };

  // 当前选中的组件
  private widgetDataSelect: any = null;

  // 是否显示配置预览弹出框
  private configPreviewModalVisible = false;
  // 配置预览数据
  private configPreviewData = '';

  // 是否显示预览弹框
  private previewVisible = false;

  // 是否显示导入配置弹框
  private importModalVisible = false;
  // 需要导入的配置数据
  private importData = '';

  /**
   * 拖拽开始的事件
   */
  private handleMoveStart({ oldIndex }: any) {
    // console.log('start', oldIndex, this.basicComponents);
  }

  /**
   * 拖拽完成时的事件
   * @param evt
   */
  private handleMoveEnd(evt: any) {
    // console.log('end', evt);
  }

  /**
   * 更新当前选中的数据
   * @param value 当前选中的组件对象
   */
  private updateWidgetDataSelect(value: any) {
    this.widgetDataSelect = value;
  }

  private models: any = {};

  render() {
    return (
      <div class="form-designer">
        <Layout class="form-designer-wrapper">
          {/* 左边侧边栏 */}
          <Layout.Sider theme="light" width="250" class="form-designer-wrapper-sider left">
            <div class="components-list">
              {this.inputComps.length > 0 && [
                <a-divider>输入组件</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.inputComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={() => true}
                >
                  {this.inputComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {item.fieldProperties.title}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
              {this.layoutComps.length > 0 && [
                <a-divider>布局组件</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.layoutComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={(e: any) => {
                    const container = e.relatedContext.component;
                    return container.$attrs.acceptCompType.includes('layout');
                  }}
                >
                  {this.layoutComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {item.fieldProperties.title}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
              {this.layoutComps.length > 0 && [
                <a-divider>自增组件</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.arrayComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={(e: any) => {
                    const container = e.relatedContext.component;
                    return container.$attrs.acceptCompType.includes('array');
                  }}
                >
                  {this.arrayComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {item.fieldProperties.title}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
            </div>
          </Layout.Sider>

          {/* 中间配置中心 */}
          <Layout class="form-designer-wrapper-center">
            {/* 中间顶部工具栏 */}
            <Layout.Header class="header-toolbar">
              <a-space>
                {this.upload && (
                  <a-button
                    type="primary"
                    icon="import"
                    onClick={() => {
                      this.importModalVisible = true;
                    }}
                  >
                    导入配置
                  </a-button>
                )}
                {this.clearable && (
                  <a-button
                    type="primary"
                    icon="delete"
                    onClick={() => {
                      this.$confirm({
                        content: '确定清空所有配置吗？',
                        onOk: () => {
                          this.widgetData = {
                            list: [],
                            config: { ...FormConfigModel },
                            key: createHash(12),
                          };

                          this.widgetDataSelect = null;
                        },
                      });
                    }}
                  >
                    清空
                  </a-button>
                )}
                {this.preview && (
                  <a-button
                    type="primary"
                    icon="eye"
                    onClick={() => {
                      this.previewVisible = true;
                    }}
                  >
                    预览
                  </a-button>
                )}
                {this.generateJson && (
                  <a-button
                    type="primary"
                    icon="download"
                    onClick={() => {
                      this.configPreviewData = JSON.stringify(this.widgetData, null, 2);
                      this.configPreviewModalVisible = true;
                    }}
                  >
                    生成配置
                  </a-button>
                )}
                {this.generateCode && (
                  <a-button type="primary" icon="codepen">
                    生成代码
                  </a-button>
                )}
              </a-space>
            </Layout.Header>
            {/* 中间配置内容 */}
            <Layout.Content class="content-config">
              <div class="content-config-container">
                <WidgetForm
                  data={this.widgetData}
                  select={this.widgetDataSelect}
                  on={{ ['update:select']: this.updateWidgetDataSelect }}
                ></WidgetForm>
              </div>
            </Layout.Content>
          </Layout>

          {/* 右边侧边栏 */}
          <Layout.Sider theme="light" width="250" class="form-designer-wrapper-sider right">
            <a-tabs
              default-active-key="1"
              onChange={() => {}}
              style="height: 100%;"
              tabBarStyle={{ textAlign: 'center', marginBottom: 0 }}
            >
              <a-tab-pane
                key="1"
                scopedSlots={{
                  tab: () => {
                    return (
                      <a-tooltip
                        placement="bottomRight"
                        arrowPointAtCenter
                        title="组件属性，包含输入组件和布局组件等配置"
                      >
                        属性配置
                      </a-tooltip>
                    );
                  },
                }}
              >
                <PropertyConfig data={this.widgetData} select={this.widgetDataSelect} />
              </a-tab-pane>
              <a-tab-pane
                key="2"
                force-render
                scopedSlots={{
                  tab: () => {
                    return (
                      <a-tooltip
                        placement="bottomRight"
                        arrowPointAtCenter
                        title="全局设置表单属性，组件如果有相同属性则会以组件优先级最高"
                      >
                        表单配置
                      </a-tooltip>
                    );
                  },
                }}
              >
                <FormConfig data={this.widgetData.config} />
              </a-tab-pane>
            </a-tabs>
          </Layout.Sider>

          {/* 配置数据预览弹出框 */}
          <a-modal
            vModel={this.configPreviewModalVisible}
            title="配置数据"
            centered
            keyboard={false}
            maskClosable={false}
            width={800}
            onOk={() => {
              this.configPreviewModalVisible = false;
            }}
          >
            <CustomEditor
              value={this.configPreviewData}
              height="400"
              lang="json"
              readOnly
            ></CustomEditor>
          </a-modal>

          {/* 导入配置弹出框 */}
          <a-modal
            vModel={this.importModalVisible}
            title="导入配置"
            centered
            destroyOnClose
            keyboard={false}
            maskClosable={false}
            width={800}
            onOk={() => {
              try {
                this.widgetData = JSON.parse(this.importData);

                // 如果存在至少一个配置，默认将第一个置为选中
                if (this.widgetData.list.length > 0) {
                  this.updateWidgetDataSelect(this.widgetData.list[0]);
                }
              } catch (e) {
                this.$message.error((e as any).message);
              }

              // 导入完成后清空数据
              this.importData = '';
              this.importModalVisible = false;
            }}
          >
            <a-alert
              message="直接书写JSON，或直接复制生成的JSON进行覆盖"
              type="info"
              show-icon
              style="margin-bottom: 10px;"
            />

            <CustomEditor
              value={this.importData}
              height="400"
              lang="json"
              onChange={(value: string) => {
                this.importData = value;
              }}
            ></CustomEditor>
          </a-modal>

          {/* 组件预览弹出框 */}
          <a-modal
            vModel={this.previewVisible}
            title="组件预览"
            centered
            destroyOnClose
            keyboard={false}
            maskClosable={false}
            width={1000}
            onCancel={() => {
              this.models = {};
            }}
            scopedSlots={{
              footer: () => {
                return [
                  <a-button
                    onClick={() => {
                      this.previewVisible = false;
                      this.models = {};
                    }}
                  >
                    取消
                  </a-button>,
                  <a-button
                    type="primary"
                    onClick={() => {
                      this.previewVisible = false;
                      this.models = {};
                    }}
                  >
                    确认
                  </a-button>,
                  <a-button
                    type="primary"
                    onClick={() => {
                      this.$refs.generator
                        .getData()
                        .then((data: any) => {
                          console.log('当前数据', data);
                        })
                        .catch((error: any) => {
                          console.log('错误信息', error);
                        });
                    }}
                  >
                    获取数据
                  </a-button>,
                  <a-button
                    type="primary"
                    onClick={() => {
                      this.$refs.generator.reset();
                    }}
                  >
                    重置
                  </a-button>,
                ];
              },
            }}
          >
            <Generator
              config={this.widgetData}
              vModel={this.models}
              ref="generator"
              onChange={(data: any) => {
                console.log('响应数据', data);
              }}
            />
          </a-modal>
        </Layout>
      </div>
    );
  }
}
