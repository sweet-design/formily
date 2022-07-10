import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import { inputComponents, layoutComponents } from './Models';
import { Layout } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import FormConfigModel, { FormModel } from './Models/Form/form';
import FormConfig from './components/Config/FormConfig';
import PropertyConfig from './components/Config/PropertyConfig';
import WidgetForm from './components/Designer/WidgetForm';
import { createHash, generateComponentList } from './utils/format';
import CustomEditor from './components/CustomEditor';
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
    default: true,
  })
  generateCode!: boolean;

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
   * 注入生成组件树函数
   * @param filterNode 过滤的节点唯一编号
   * @returns 组件目录树结构
   */
  @Provide('generateComponentList')
  generateList = (filterNode: string[] = []) => {
    return generateComponentList(this.widgetData, filterNode);
  };

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
          this.generateComponentTree(temp.children, item.componentProperties.columns, filterNode);
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

  // 根据输入组件类别过滤后的输入组件配置
  private inputComponents = inputComponents.filter(item => {
    return this.inputComps.indexOf(item.fieldProperties.type) != -1;
  });

  // 根据布局组件类别过滤后的布局组件配置
  private layoutComponents = layoutComponents.filter(item => {
    return this.layoutComps.indexOf(item.fieldProperties.type) != -1;
  });

  // 表单组件所有配置数据
  private widgetData = {
    list: [],
    config: { ...FormConfigModel, key: createHash(12) },
  };

  // 当前选中的组件
  private widgetDataSelect: any = null;

  // 是否显示json配置预览弹出框
  private jsonConfigVisible = false;
  // json配置数据
  private jsonConfig = '';

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
            </div>
          </Layout.Sider>

          {/* 中间配置中心 */}
          <Layout class="form-designer-wrapper-center">
            {/* 中间顶部工具栏 */}
            <Layout.Header class="header-toolbar">
              {this.upload && (
                <a-button type="primary" icon="import">
                  导入JSON
                </a-button>
              )}
              {this.clearable && (
                <a-button type="primary" icon="delete" style="margin-left: 8px;">
                  清空
                </a-button>
              )}
              {this.preview && (
                <a-button type="primary" icon="eye" style="margin-left: 8px;">
                  预览
                </a-button>
              )}
              {this.generateJson && (
                <a-button
                  type="primary"
                  icon="download"
                  style="margin-left: 8px;"
                  onClick={() => {
                    this.jsonConfig = JSON.stringify(this.widgetData, null, 2);
                    this.jsonConfigVisible = true;
                  }}
                >
                  生成JSON
                </a-button>
              )}
              {this.generateCode && (
                <a-button type="primary" icon="codepen" style="margin-left: 8px;">
                  生成代码
                </a-button>
              )}
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

          <a-modal
            vModel={this.jsonConfigVisible}
            title="JSON配置数据"
            centered
            keyboard={false}
            maskClosable={false}
            width={800}
            onOk={() => {
              this.jsonConfigVisible = false;
            }}
          >
            <CustomEditor value={this.jsonConfig} height="500" lang="json" readOnly></CustomEditor>
          </a-modal>
        </Layout>
      </div>
    );
  }
}
