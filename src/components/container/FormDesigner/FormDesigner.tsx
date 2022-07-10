import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Clipboard from 'clipboard';
import { Layout } from 'ant-design-vue';
import Draggable from 'vuedraggable';
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig';
import WidgetForm from './Designer/WidgetForm';
import WidgetConfig from './Config/WidgetConfig';
import FormConfig from './Config/FormConfig';
import CustomModal from './CustomModal';
import GenerateForm from './Generator/GenerateForm';
import { transformConfig } from './utils/dataFormat';
import './index.less';

@Component
export default class FormDesigner extends Vue {
  /**
   * 基础字段
   */
  @Prop({
    type: Array,
    default: () => [
      'input',
      'textarea',
      'number',
      'radio',
      'checkbox',
      'time',
      'date',
      'rate',
      'color',
      'ddList',
      'treeSelect',
      'customSelector',
      'select',
      'switch',
      'slider',
      'text',
      'button',
      'html',
    ],
  })
  basicFields!: Array<string>;

  /**
   * 高级字段
   */
  @Prop({
    type: Array,
    default: () => ['blank', 'imgupload', 'editor', 'cascader', 'table'],
  })
  advanceFields!: Array<string>;

  /**
   * 布局字段
   */
  @Prop({
    type: Array,
    default: () => ['grid'],
  })
  layoutFields!: Array<string>;

  /**
   * 是否显示导入JSON按钮
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  upload!: boolean;

  /**
   * 是否显示清空按钮
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  clearable!: boolean;

  /**
   * 是否显示预览按钮
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  preview!: boolean;

  /**
   * 是否显示生成JSON按钮
   */
  @Prop({
    type: Boolean,
    default: false,
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
   * 远端方法对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remoteFuncs!: Record<string, any>;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  static install: (Vue: Vue) => void;

  private basicComponents = basicComponents.filter(item => {
    return this.basicFields.indexOf(item.type) != -1;
  });
  private advanceComponents = advanceComponents.filter(item => {
    return this.advanceFields.indexOf(item.type) != -1;
  });
  private layoutComponents = layoutComponents.filter(item => {
    return this.layoutFields.indexOf(item.type) != -1;
  });

  /**
   * 编辑器配置数据
   */
  private editorConfig = {
    enableBasicAutocompletion: true,
    enableSnippets: true, // 是否启用代码片段 比如 js for循环
    enableLiveAutocompletion: true, // 自动补全
    tabSize: 4,
    fontSize: 14,
    showPrintMargin: false, // 去除编辑器里的竖线
  };

  private Editor = require('vue2-ace-editor'); // 加载编辑器组件
  private jsonVisible = false; // 是否显示生成JSON弹框
  private jsonTemplate = ''; // JSON字符串配置数据
  private jsonClipboard: any = null; // 剪贴板存储临时对象
  private jsonCopyValue = ''; // 复制的json字符串

  private uploadVisible = false; // 是否显示导入JSON弹出框
  private jsonEg = {
    list: [],
    config: {
      labelCol: 6,
      labelAlign: 'right',
      size: 'default',
    },
  };
  private jsonEgData = '';

  private previewVisible = false; // 是否显示预览表单
  private widgetModels = {}; // 预览时默认给表单的实体数据

  $refs!: {
    generateForm: GenerateForm;
    uploadJson: any;
    widgetFormRef: Vue;
  };

  // 表单组件所有数据
  private widgetData = {
    list: [],
    config: {
      labelCol: 6,
      labelAlign: 'right',
      size: 'default',
    },
  };

  // 当前选中的字段（基础，高级，布局）配置数据
  private widgetDataSelect: any = null;

  /**
   * 拖拽完成时的事件
   * @param evt
   */
  private handleMoveEnd(evt: any) {
    // console.log('end', evt);
  }

  /**
   * 拖拽开始的事件
   */
  private handleMoveStart({ oldIndex }: any) {
    // console.log('start', oldIndex, this.basicComponents);
  }

  /**
   * 更新当前选中的数据
   */
  private updateWidgetFormSelect(value: any) {
    this.widgetDataSelect = value;
  }

  @Watch('widgetData', { deep: true })
  protected watchWidgetForm(newVal: any, oldVal: any) {
    // console.log(this.$refs.widgetFormRef);
  }

  /**
   * 清除所有配置
   */
  private clearAllConfig() {
    this.$confirm({
      content: `${this.$t('pageDesign.description.clearConfigConfirm')}`,
      onOk: () => {
        this.widgetData = {
          list: [],
          config: {
            labelCol: 6,
            labelAlign: 'right',
            size: 'default',
          },
        };

        this.widgetDataSelect = null;
      },
    });
  }

  /**
   * 打开生成JSON弹框
   */
  private handleGenerateJson() {
    this.jsonTemplate = JSON.stringify(this.widgetData, null, 4);
    this.jsonVisible = true;
    this.$nextTick(() => {
      if (!this.jsonClipboard) {
        this.jsonClipboard = new Clipboard('.json-btn');
        this.jsonClipboard.on('success', () => {
          this.$message.success('复制成功');
        });
      }

      this.jsonCopyValue = JSON.stringify(this.widgetData);
    });
  }

  /**
   * 预览表单
   */
  private handlePreview() {
    this.previewVisible = true;
  }

  /**
   * 打开导入JSON弹出框
   */
  private handleUpload() {
    this.jsonEgData = JSON.stringify(this.jsonEg, null, 4);
    this.uploadVisible = true;
  }

  // 上传json后进行设置
  private setJSON(json: any) {
    this.widgetData = transformConfig(json);

    if (this.widgetData.list.length > 0) {
      this.updateWidgetFormSelect(this.widgetData.list[0]);
    }
  }

  private handleUploadJson() {
    try {
      this.setJSON(JSON.parse(this.jsonEgData));
      this.uploadVisible = false;
    } catch (e) {
      this.$message.error((e as any).message);
      this.$refs.uploadJson.end();
    }
  }

  /**
   * 表单预览中数据改变
   * @param data 整个form表单数据模型
   * @param value 改变的当前新值
   * @param key 当前改变值的key
   */
  private handleDataChange(data: Record<string, any>, value: any, key: string) {
    // console.log(value, key, data);
  }

  public handleReset() {
    this.$refs.generateForm.reset();
  }

  /**
   * 组件预览时进行测试
   */
  public handleTest() {
    this.$refs.generateForm
      .getData()
      .then(data => {
        this.$confirm({
          content: JSON.stringify(data),
        });
        // this.$alert(data, '').catch(e => {});
        // this.$refs.widgetPreview.end();
      })
      .catch(e => {
        // this.$refs.widgetPreview.end();
      });
  }

  // 初始化编辑器
  editorInit() {
    require('brace/theme/chrome');
    require('brace/ext/language_tools');
    require('brace/mode/yaml');
    require('brace/mode/json');
    require('brace/mode/less');
    require('brace/snippets/json');
  }

  /**
   * 获取页面配置信息
   * @returns 页面所有配置信息
   */
  public getConfigData(): Record<string, any> {
    return this.widgetData;
  }

  /**
   * 设置配置数据
   * @param data json配置数据
   */
  public setConfigData(data: Record<string, any>) {
    this.setJSON(data);
  }

  render() {
    return (
      <div class="component-form-designer">
        <Layout class="form-designer-wrapper">
          <Layout.Sider theme="light" width="250" class="form-designer-wrapper-sider left">
            <div class="components-list">
              {this.basicFields.length > 0 && [
                <a-divider>{this.$t('pageDesign.basic.title')}</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.basicComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={() => true}
                >
                  {this.basicComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {this.$t(item.name)}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
              {this.advanceFields.length > 0 && [
                <a-divider>{this.$t('pageDesign.advance.title')}</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.advanceComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={() => true}
                >
                  {this.advanceComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {this.$t(item.name)}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
              {this.layoutFields.length > 0 && [
                <a-divider>{this.$t('pageDesign.layout.title')}</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.layoutComponents}
                  group={{ name: 'people', pull: 'clone', put: false }}
                  sort={false}
                  ghostClass="ghost"
                  onEnd={this.handleMoveEnd}
                  onStart={this.handleMoveStart}
                  move={() => true}
                >
                  {this.layoutComponents.map((item, index) => {
                    return (
                      <li class="component-template" key={index}>
                        <a-button type="dashed" style="width: 100%;">
                          {this.$t(item.name)}
                        </a-button>
                      </li>
                    );
                  })}
                </Draggable>,
              ]}
            </div>
          </Layout.Sider>
          <Layout class="form-designer-wrapper-center">
            <Layout.Header class="header-tools">
              {this.upload && (
                <a-button type="primary" icon="import" onClick={this.handleUpload}>
                  {this.$t('pageDesign.action.importJSON')}
                </a-button>
              )}
              {this.clearable && (
                <a-button
                  type="primary"
                  icon="delete"
                  style="margin-left: 8px;"
                  onClick={this.clearAllConfig}
                >
                  {this.$t('pageDesign.action.clear')}
                </a-button>
              )}
              {this.preview && (
                <a-button
                  type="primary"
                  icon="eye"
                  style="margin-left: 8px;"
                  onClick={this.handlePreview}
                >
                  {this.$t('pageDesign.action.preview')}
                </a-button>
              )}
              {this.generateJson && (
                <a-button
                  type="primary"
                  icon="download"
                  style="margin-left: 8px;"
                  onClick={this.handleGenerateJson}
                >
                  {this.$t('pageDesign.action.generateJSON')}
                </a-button>
              )}
              {this.generateCode && (
                <a-button type="primary" icon="codepen" style="margin-left: 8px;">
                  {this.$t('pageDesign.action.code')}
                </a-button>
              )}
            </Layout.Header>
            <Layout.Content class="form-designer-wrapper-center-content">
              <div class="form-designer-wrapper-center-content-container">
                <WidgetForm
                  ref="widgetFormRef"
                  data={this.widgetData}
                  select={this.widgetDataSelect}
                  plugins={this.plugins}
                  on={{ ['update:select']: this.updateWidgetFormSelect }}
                ></WidgetForm>
              </div>
            </Layout.Content>
          </Layout>
          <Layout.Sider theme="light" width="250" class="form-designer-wrapper-sider right">
            <a-tabs
              default-active-key="1"
              onChange={() => {}}
              style="height: 100%;"
              tabBarStyle={{ textAlign: 'center', marginBottom: 0 }}
            >
              <a-tab-pane key="1" tab={this.$t('pageDesign.config.widget.title')}>
                <WidgetConfig data={this.widgetDataSelect} plugins={this.plugins} />
              </a-tab-pane>
              <a-tab-pane key="2" tab={this.$t('pageDesign.config.form.title')} force-render>
                <FormConfig data={this.widgetData.config} />
              </a-tab-pane>
            </a-tabs>
          </Layout.Sider>

          {/* 生成JSON数据弹出框 */}
          <CustomModal
            ref="jsonPreview"
            form
            width={800}
            title="JSON数据"
            visible={this.jsonVisible}
            onClose={() => {
              this.jsonVisible = false;
            }}
            scopedSlots={{
              action: () => {
                return [
                  <a-button
                    onClick={() => {
                      this.jsonVisible = false;
                    }}
                  >
                    {this.$t('pageDesign.action.cancel')}
                  </a-button>,
                  <a-button
                    class="json-btn"
                    type="primary"
                    data-clipboard-text={this.jsonCopyValue}
                  >
                    {this.$t('pageDesign.action.copyData')}
                  </a-button>,
                ];
              },
            }}
          >
            <this.Editor
              vModel={this.jsonTemplate}
              theme="chrome"
              lang="json"
              width="100%"
              height="300"
              onInit={this.editorInit}
              options={this.editorConfig}
            ></this.Editor>
          </CustomModal>

          {/* 导入JSON弹出框 */}
          <CustomModal
            ref="uploadJson"
            form
            width={800}
            title={this.$t('pageDesign.action.importJSON')}
            visible={this.uploadVisible}
            onClose={() => {
              this.uploadVisible = false;
            }}
            onSubmit={this.handleUploadJson}
          >
            <a-alert
              message={this.$t('pageDesign.description.uploadJsonInfo')}
              type="info"
              show-icon
              closable
              style="margin-bottom: 10px;"
            />
            <this.Editor
              vModel={this.jsonEgData}
              theme="chrome"
              lang="json"
              width="100%"
              height="300"
              onInit={this.editorInit}
              options={this.editorConfig}
            ></this.Editor>
          </CustomModal>

          {/* 组件预览 */}
          <CustomModal
            ref="widgetPreview"
            form
            width={800}
            title={this.$t('pageDesign.description.componentPreview')}
            visible={this.previewVisible}
            onClose={() => {
              this.previewVisible = false;
            }}
            scopedSlots={{
              action: () => {
                return [
                  <a-button type="primary" onClick={this.handleTest}>
                    {this.$t('pageDesign.action.getData')}
                  </a-button>,
                  <a-button class="json-btn" type="primary" onClick={this.handleReset}>
                    {this.$t('pageDesign.action.reset')}
                  </a-button>,
                ];
              },
            }}
          >
            {this.previewVisible && (
              <GenerateForm
                onChange={this.handleDataChange}
                data={this.widgetData}
                value={this.widgetModels}
                plugins={this.plugins}
                remote={this.remoteFuncs}
                ref="generateForm"
              ></GenerateForm>
            )}
          </CustomModal>
        </Layout>
      </div>
    );
  }
}
