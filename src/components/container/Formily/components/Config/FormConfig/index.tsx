import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { FormModel } from '../../../Models/Form/form';
import SwitchType from '../../SwitchType';
import CustomEditor from '../../CustomEditor';
import { getExecStrs, createHash } from '../../../utils/format';
import { loadCssCode } from '../../../utils';
import { singleApiGenerator } from '../../../utils/apiGenerator';
import './index.less';

@Component
export default class FormConfig extends Vue {
  /**
   * form model config data
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: FormModel;

  private classList: string[] = []; // 根据自定义样式，扫描出来的class类名供自定义class选择
  private cssDefaultValue = ''; // 自定义css临时存储值
  private cssModalVisible = false; // 是否显示css编辑器

  private actions: any[] = []; // 动作列表临时存储数据
  private selectedAction = 0; // 当前选中的action的索引值
  private actionModalVisible = false; // 是否显示动作编辑器
  private actionForm: any = null; // 当前选中的动作表单对象

  private apis: any[] = []; // api列表临时存储数据
  private selectedApis = 0; // 当前选中的api的索引值
  private apisModalVisible = false; // 是否显示api编辑器
  private apiForm: any = null; // 当前选中的表单对象

  private lifecyclesModalVisible = false; // 是否显示生命周期编辑器
  private lifecycles: any[] = []; // 生命周期列表数据临时存储值
  private selectedLifecycles = 0; // 当前选中的生命周期的索引值
  private lifecyclesForm: any = null; // 当前选中的生命周期表单对象

  private cssId = ''; // css 编号

  /**
   * 生成action 模型数据
   */
  private generatorActionModel(name?: string, body?: string) {
    return {
      key: createHash(12),
      name: name ? name + '_copy' : `func_${createHash(12)}`,
      body: body ?? '',
    };
  }

  /**
   * 生成apis 模型数据
   */
  private generatorApisModel(
    name?: string,
    method?: string,
    auto?: boolean,
    headers?: Array<any>,
    params?: Array<any>,
    bodyType?: string,
    body?: Array<any>,
    requestInterceptor?: string,
    responseInterceptor?: string,
    error?: string,
  ) {
    return {
      key: createHash(12),
      name: name ? name + '_copy' : `func_${createHash(12)}`,
      url: '',
      method: method ?? 'GET',
      auto: auto ?? false,
      headers: headers ?? [],
      params: params ?? [],
      bodyType: bodyType ?? 'json',
      body: body ?? [],
      requestInterceptor: requestInterceptor ?? '',
      responseInterceptor: responseInterceptor ?? '',
      error: error ?? '',
    };
  }

  render() {
    const config = this.data;

    return (
      <div class="form-model-config-wrapper">
        <a-form-model label-col={{ span: 0 }} wrapper-col={{ span: 24 }}>
          <a-divider>
            <a-tooltip placement="left" title="只在布局方式为'水平'时可用">
              标签栅格宽度
            </a-tooltip>
          </a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-input-number vModel={config.labelCol} min={1} max={24} />
            </div>
          </a-form-model-item>

          <a-divider>
            <a-tooltip placement="left" title="只在布局方式为'水平'时可用">
              组件栅格宽度
            </a-tooltip>
          </a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-input-number vModel={config.wrapperCol} min={1} max={24} />
            </div>
          </a-form-model-item>

          <a-divider>标签宽度</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <SwitchType
                value={config.labelWidth}
                onChange={(value: string) => {
                  config.labelWidth = value;
                }}
              />
            </div>
          </a-form-model-item>

          <a-divider>组件宽度</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <SwitchType
                value={config.wrapperWidth}
                onChange={(value: string) => {
                  config.wrapperWidth = value;
                }}
              />
            </div>
          </a-form-model-item>

          <a-divider>标签对齐方式</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-radio-group vModel={config.labelAlign} buttonStyle="solid">
                <a-radio-button value="left">左</a-radio-button>
                <a-radio-button value="right">右</a-radio-button>
              </a-radio-group>
            </div>
          </a-form-model-item>

          <a-divider>组件对齐方式</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-radio-group vModel={config.wrapperAlign} buttonStyle="solid">
                <a-radio-button value="left">左</a-radio-button>
                <a-radio-button value="right">右</a-radio-button>
              </a-radio-group>
            </div>
          </a-form-model-item>

          <a-divider>布局方式</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-select vModel={config.layout}>
                <a-select-option value="horizontal">水平</a-select-option>
                <a-select-option value="vertical">垂直</a-select-option>
                <a-select-option value="inline">内联</a-select-option>
              </a-select>
            </div>
          </a-form-model-item>

          <a-divider>尺寸</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-radio-group vModel={config.size} buttonStyle="solid">
                <a-radio-button value="large">大</a-radio-button>
                <a-radio-button value="default">默认</a-radio-button>
                <a-radio-button value="small">小</a-radio-button>
              </a-radio-group>
            </div>
          </a-form-model-item>

          <a-divider>表单宽度</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <SwitchType
                value={config.style.width}
                onChange={(value: string) => {
                  config.style.width = value;
                }}
              />
            </div>
          </a-form-model-item>

          <a-divider>表单高度</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <SwitchType
                value={config.style.height}
                onChange={(value: string) => {
                  config.style.height = value;
                }}
              />
            </div>
          </a-form-model-item>

          <a-divider>渲染引擎</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-select
                vModel={config.renderEngine}
                onChange={(value: string) => {
                  if (value === 'react') {
                    config.renderUI = 'antd';
                  } else {
                    config.renderUI = 'ant-design-vue';
                  }
                }}
              >
                <a-select-option value="vue2">vue2</a-select-option>
                <a-select-option value="vue3">vue3</a-select-option>
                <a-select-option value="react">react</a-select-option>
              </a-select>
            </div>
          </a-form-model-item>

          <a-divider>渲染UI</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-select vModel={config.renderUI}>
                {config.renderEngine !== 'react' && [
                  <a-select-option value="ant-design-vue">ant-design-vue</a-select-option>,
                  <a-select-option value="vant2">vant2</a-select-option>,
                  <a-select-option value="vant3">vant3</a-select-option>,
                ]}
                {config.renderEngine === 'react' && (
                  <a-select-option value="antd">antd</a-select-option>
                )}
              </a-select>
            </div>
          </a-form-model-item>

          <a-divider>自定义类名</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-select mode="tags" vModel={config.customClass}>
                {this.classList.map((item, index) => {
                  return (
                    <a-select-option key={(index + 9).toString(36) + index} value={item}>
                      {item}
                    </a-select-option>
                  );
                })}
              </a-select>
            </div>
          </a-form-model-item>

          <a-divider>自定义style</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-button
                onClick={() => {
                  this.cssDefaultValue = config.customStyle;
                  this.cssModalVisible = true;
                }}
              >
                配置
              </a-button>
            </div>
          </a-form-model-item>

          <a-divider>客户端环境</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-select vModel={config.clientEnv}>
                <a-select-option value="pc">PC</a-select-option>
                <a-select-option value="mobile">Mobile</a-select-option>
              </a-select>
            </div>
          </a-form-model-item>

          <a-divider>动作响应中心</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-button
                onClick={() => {
                  this.actions = JSON.parse(JSON.stringify(config.actions));
                  this.actionForm = this.actions[0] ?? null;
                  this.actionModalVisible = true;
                }}
              >
                配置
              </a-button>
            </div>
          </a-form-model-item>

          <a-divider>API接口中心</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-button
                onClick={() => {
                  this.apis = JSON.parse(JSON.stringify(config.apis));
                  this.apiForm = this.apis[0] ?? null;
                  this.apisModalVisible = true;
                }}
              >
                配置
              </a-button>
            </div>
          </a-form-model-item>

          <a-divider>生命周期</a-divider>
          <a-form-model-item>
            <div class="feild-item">
              <a-button
                onClick={() => {
                  this.lifecycles = JSON.parse(JSON.stringify(config.lifecycles));
                  this.lifecyclesForm = this.lifecycles[0] ?? null;
                  this.lifecyclesModalVisible = true;
                }}
              >
                配置
              </a-button>
            </div>
          </a-form-model-item>
        </a-form-model>

        {/* 自定义style编辑器 */}
        <a-modal
          vModel={this.cssModalVisible}
          title="自定义style"
          centered
          keyboard={false}
          maskClosable={false}
          getContainer={() => {
            return document.querySelector('.form-model-config-wrapper');
          }}
          width={800}
          onOk={() => {
            if (this.cssDefaultValue.trim() !== '' && config.customStyle !== this.cssDefaultValue) {
              const styleDom = document.getElementById(`${this.cssId}`);
              if (styleDom) styleDom.remove();

              const key = createHash(12);
              loadCssCode(this.cssDefaultValue, key);
              this.cssId = key;
            }
            // 扫描css代码中的classname
            config.customStyle = this.cssDefaultValue;
            this.cssModalVisible = false;
            this.classList = getExecStrs(config.customStyle);
          }}
        >
          <a-alert
            message="直接书写css代码，或在IDE中编写css代码进行覆盖"
            type="info"
            show-icon
            style="margin-bottom: 10px;"
          />
          <CustomEditor
            value={this.cssDefaultValue}
            onChange={(value: string) => {
              this.cssDefaultValue = value;
            }}
            lang="css"
          ></CustomEditor>
        </a-modal>

        {/* 动作响应中心 */}
        <a-modal
          vModel={this.actionModalVisible}
          title="动作响应中心"
          centered
          keyboard={false}
          bodyStyle={{ backgroundColor: '#f0f2f5' }}
          maskClosable={false}
          getContainer={() => {
            return document.querySelector('.form-model-config-wrapper');
          }}
          width={1000}
          onOk={() => {
            this.data.actions = this.actions;
            this.actionModalVisible = false;
          }}
          onCancel={() => {
            this.selectedAction = 0;
          }}
        >
          <div style="min-height: 500px">
            <a-alert
              message="每个动作即为一个函数，且响应体中只能书写原生JavaScript代码，如果为空，将不执行，反之亦然"
              type="info"
              show-icon
              style="margin-bottom: 10px;"
            />
            <div>
              <a-space>
                <a-button
                  type="primary"
                  onClick={() => {
                    this.actions.push(this.generatorActionModel());
                    this.selectedAction = this.actions.length - 1;
                    this.actionForm = this.actions[this.selectedAction];
                  }}
                >
                  新增动作
                </a-button>
                <a-button
                  type="danger"
                  disabled={this.actions.length === 0}
                  onClick={() => {
                    this.actions.splice(0);
                  }}
                >
                  清空动作
                </a-button>
              </a-space>
            </div>
            {this.actions.length === 0 && <a-empty style="margin-top: 40px" />}
            {this.actions.length > 0 && (
              <a-row type="flex" gutter={10} class="form-model-config">
                <a-col span={8}>
                  <div class="form-model-config-left">
                    {this.actions.map((item, index) => {
                      return (
                        <div
                          class={{
                            'form-model-config-left-item': true,
                            selected: index === this.selectedAction,
                          }}
                          onClick={() => {
                            this.selectedAction = index;
                            this.actionForm = this.actions[index];
                          }}
                        >
                          <span class="form-model-config-left-item-text">{item.name}</span>
                          <div class="form-model-config-left-item-opt">
                            <a-space>
                              <a-tooltip
                                placement="top"
                                title="复制动作"
                                onClick={() => {
                                  this.actions.push(
                                    this.generatorActionModel(item.name, item.body),
                                  );
                                }}
                              >
                                <a-icon type="copy" />
                              </a-tooltip>

                              <a-tooltip placement="top" title="删除动作">
                                <a-icon
                                  type="delete"
                                  onClick={(e: Event) => {
                                    e.stopPropagation();
                                    this.actions.splice(index, 1);

                                    if (index < this.selectedAction) {
                                      this.selectedAction--;
                                    } else if (index === this.selectedAction) {
                                      if (this.actions.length > 0) {
                                        if (index === this.actions.length) {
                                          this.selectedAction--;
                                        }

                                        this.actionForm = this.actions[this.selectedAction];
                                      } else {
                                        this.actionForm = null;
                                      }
                                    }
                                  }}
                                />
                              </a-tooltip>
                            </a-space>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </a-col>
                <a-col span={16}>
                  <div class="form-model-config-right">
                    <a-form-model
                      props={{ model: this.actionForm }}
                      label-col={{ span: 4 }}
                      wrapper-col={{ span: 20 }}
                    >
                      <a-form-model-item
                        label="名称"
                        prop="name"
                        rules={{
                          required: true,
                          message: '请输入名称',
                          trigger: 'blur',
                        }}
                      >
                        <a-input vModel={this.actionForm.name}>
                          <a-tooltip
                            slot="suffix"
                            placement="left"
                            title="默认会生成hash值，此名称不作为函数调用方法名，支持中文，若以英文尽量以小驼峰命名，切记不要使用空格或特殊字符"
                          >
                            <a-icon type="question-circle-o" style="color: rgba(0,0,0,.45)" />
                          </a-tooltip>
                        </a-input>
                      </a-form-model-item>
                      <a-form-model-item label="响应体">
                        <div>
                          (data:{' '}
                          <a-tooltip
                            scopedSlots={{
                              title: () => {
                                return [
                                  <div>{'type DataInterface = {'}</div>,
                                  <div>&nbsp;&nbsp;{'// 当前控件值'}</div>,
                                  <div>&nbsp;&nbsp;{'value: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 表单整体数据对象'}</div>,
                                  <div>&nbsp;&nbsp;{'model: Object;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 日期插件'}</div>,
                                  <div>&nbsp;&nbsp;{'dayjs: Dayjs;'}</div>,
                                  <div>{'}'}</div>,
                                ];
                              },
                            }}
                          >
                            <span style="color: rgb(86, 182, 194);">DataInterface</span>
                          </a-tooltip>
                          ) ={'> {'}
                        </div>
                        <CustomEditor
                          height="200"
                          onChange={(value: string) => {
                            this.actionForm.body = value;
                          }}
                          value={this.actionForm.body}
                          lang="javascript"
                        ></CustomEditor>
                        <div>{'}'}</div>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-col>
              </a-row>
            )}
          </div>
        </a-modal>

        {/* API接口中心 */}
        <a-modal
          vModel={this.apisModalVisible}
          title="API接口中心"
          centered
          bodyStyle={{ backgroundColor: '#f0f2f5' }}
          keyboard={false}
          maskClosable={false}
          getContainer={() => {
            return document.querySelector('.form-model-config-wrapper');
          }}
          width={1000}
          onOk={() => {
            this.data.apis = this.apis;
            this.apisModalVisible = false;
          }}
          onCancel={() => {
            this.selectedApis = 0;
          }}
        >
          <div style="min-height: 500px">
            <a-alert
              message="每个API接口即为一个函数，且响应体中只能书写原生JavaScript代码，如果为空，将不执行，反之亦然"
              type="info"
              show-icon
              style="margin-bottom: 10px;"
            />
            <div>
              <a-space>
                <a-button
                  type="primary"
                  onClick={() => {
                    this.apis.push(this.generatorApisModel());
                    this.selectedApis = this.apis.length - 1;
                    this.apiForm = this.apis[this.selectedApis];
                  }}
                >
                  新增API
                </a-button>
                <a-button
                  type="danger"
                  disabled={this.apis.length === 0}
                  onClick={() => {
                    this.$confirm({
                      content: '确定清空所有API吗？',
                      onOk: () => {
                        this.apis.splice(0);
                      },
                    });
                  }}
                >
                  清空API
                </a-button>
                <a-button
                  onClick={async () => {
                    const res = await singleApiGenerator(this.apis[this.selectedApis]);
                    console.log('测试返回结果', res);
                  }}
                >
                  接口测试
                </a-button>
              </a-space>
            </div>
            {this.apis.length === 0 && <a-empty style="margin-top: 40px" />}
            {this.apis.length > 0 && (
              <a-row type="flex" gutter={10} class="form-model-config">
                <a-col span={8}>
                  <div class="form-model-config-left">
                    {this.apis.map((item, index) => {
                      return (
                        <div
                          class={{
                            'form-model-config-left-item': true,
                            selected: index === this.selectedApis,
                          }}
                          onClick={() => {
                            this.selectedApis = index;
                            this.apiForm = this.apis[index];
                          }}
                        >
                          <span class="form-model-config-left-item-text">{item.name}</span>
                          <div class="form-model-config-left-item-opt">
                            <a-space>
                              <a-tooltip
                                placement="top"
                                title="复制API"
                                onClick={() => {
                                  this.apis.push(
                                    this.generatorApisModel(
                                      item.name,
                                      item.method,
                                      item.auto,
                                      JSON.parse(JSON.stringify(item.headers)),
                                      JSON.parse(JSON.stringify(item.params)),
                                      item.bodyType,
                                      JSON.parse(JSON.stringify(item.body)),
                                      item.requestInterceptor,
                                      item.responseInterceptor,
                                      item.error,
                                    ),
                                  );
                                }}
                              >
                                <a-icon type="copy" />
                              </a-tooltip>

                              <a-tooltip placement="top" title="删除API">
                                <a-icon
                                  type="delete"
                                  onClick={(e: Event) => {
                                    e.stopPropagation();
                                    this.apis.splice(index, 1);

                                    if (index < this.selectedApis) {
                                      this.selectedApis--;
                                    } else if (index === this.selectedApis) {
                                      if (this.apis.length > 0) {
                                        if (index === this.apis.length) {
                                          this.selectedApis--;
                                        }

                                        this.apiForm = this.apis[this.selectedApis];
                                      } else {
                                        this.apiForm = null;
                                      }
                                    }
                                  }}
                                />
                              </a-tooltip>
                            </a-space>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </a-col>
                <a-col span={16}>
                  <div class="form-model-config-right">
                    <a-form-model
                      props={{ model: this.apiForm }}
                      label-col={{ span: 4 }}
                      wrapper-col={{ span: 20 }}
                    >
                      <a-form-model-item
                        label="名称"
                        prop="name"
                        rules={{
                          required: true,
                          message: '请输入名称',
                          trigger: 'blur',
                        }}
                      >
                        <a-input vModel={this.apiForm.name}>
                          <a-tooltip
                            slot="suffix"
                            placement="left"
                            title="默认会生成hash值，此名称不作为函数调用方法名，支持中文，若以英文尽量以小驼峰命名，切记不要使用空格或特殊字符"
                          >
                            <a-icon type="question-circle-o" style="color: rgba(0,0,0,.45)" />
                          </a-tooltip>
                        </a-input>
                      </a-form-model-item>
                      <a-form-model-item
                        label="接口路径"
                        prop="url"
                        ref="name"
                        autoLink={false}
                        rules={[
                          {
                            required: true,
                            message: '请输入请求地址',
                            trigger: 'blur',
                          },
                          {
                            pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
                            message: '格式不正确',
                            trigger: 'blur',
                          },
                        ]}
                      >
                        <a-input-group compact>
                          <a-select vModel={this.apiForm.method} style="width: 20%">
                            <a-select-option value="GET">GET</a-select-option>
                            <a-select-option value="POST">POST</a-select-option>
                            <a-select-option value="PATCH">PATCH</a-select-option>
                            <a-select-option value="PUT">PUT</a-select-option>
                            <a-select-option value="DELETE">DELETE</a-select-option>
                          </a-select>
                          <a-input
                            style="width: 80%"
                            onBlur={() => {
                              (this.$refs as any).name.onFieldBlur();
                            }}
                            placeholder="https://www.baidu.com/a/b/c"
                            vModel={this.apiForm.url}
                          ></a-input>
                        </a-input-group>
                      </a-form-model-item>
                      <a-form-model-item
                        scopedSlots={{
                          label: () => {
                            return (
                              <span>
                                自动
                                <a-tooltip title="是否在表单初始化时，发送请求">
                                  <a-icon
                                    type="question-circle-o"
                                    style="color: rgba(0,0,0,.45); position: relative; top: 1px; margin-left: 4px"
                                  />
                                </a-tooltip>
                              </span>
                            );
                          },
                        }}
                      >
                        <a-switch vModel={this.apiForm.auto} />
                      </a-form-model-item>
                      <a-form-model-item label="请求头">
                        {this.apiForm.headers.map((item: any, index: number) => {
                          return (
                            <a-row type="flex" gutter={10}>
                              <a-col span={6}>
                                <a-textarea placeholder="key" autoSize vModel={item.key} />
                              </a-col>
                              <a-col span={16}>
                                <a-textarea placeholder="value" autoSize vModel={item.value} />
                              </a-col>
                              <a-col span={2} style="text-align: right">
                                <a-button
                                  type="danger"
                                  icon="delete"
                                  onClick={() => {
                                    this.apiForm.headers.splice(index, 1);
                                  }}
                                />
                              </a-col>
                            </a-row>
                          );
                        })}
                        <a-button
                          type="dashed"
                          block
                          icon="plus"
                          onClick={() => {
                            this.apiForm.headers.push({
                              key: '',
                              value: '',
                            });
                          }}
                        ></a-button>
                      </a-form-model-item>
                      <a-form-model-item label="请求参数">
                        {this.apiForm.params.map((item: any, index: number) => {
                          return (
                            <a-row type="flex" gutter={10}>
                              <a-col span={6}>
                                <a-textarea placeholder="key" autoSize vModel={item.key} />
                              </a-col>
                              <a-col span={16}>
                                <a-textarea placeholder="value" autoSize vModel={item.value} />
                              </a-col>
                              <a-col span={2}>
                                <a-button
                                  type="danger"
                                  icon="delete"
                                  onClick={() => {
                                    this.apiForm.params.splice(index, 1);
                                  }}
                                />
                              </a-col>
                            </a-row>
                          );
                        })}
                        <a-button
                          type="dashed"
                          block
                          icon="plus"
                          onClick={() => {
                            this.apiForm.params.push({
                              key: '',
                              value: '',
                            });
                          }}
                        ></a-button>
                      </a-form-model-item>
                      <a-form-model-item label="请求体类型">
                        <a-radio-group vModel={this.apiForm.bodyType} button-style="solid">
                          <a-radio-button value="json">json</a-radio-button>
                          <a-radio-button value="form">form</a-radio-button>
                        </a-radio-group>
                      </a-form-model-item>
                      <a-form-model-item
                        scopedSlots={{
                          label: () => {
                            return (
                              <span>
                                请求体
                                <a-tooltip title="value值支持JSON对象">
                                  <a-icon
                                    type="question-circle-o"
                                    style="color: rgba(0,0,0,.45); position: relative; top: 1px; margin-left: 4px"
                                  />
                                </a-tooltip>
                              </span>
                            );
                          },
                        }}
                      >
                        {this.apiForm.body.map((item: any, index: number) => {
                          return (
                            <a-row type="flex" gutter={10}>
                              <a-col span={6}>
                                <a-textarea placeholder="key" autoSize vModel={item.key} />
                              </a-col>
                              <a-col span={16}>
                                <a-textarea placeholder="value" autoSize vModel={item.value} />
                              </a-col>
                              <a-col span={2}>
                                <a-button
                                  type="danger"
                                  icon="delete"
                                  onClick={() => {
                                    this.apiForm.body.splice(index, 1);
                                  }}
                                />
                              </a-col>
                            </a-row>
                          );
                        })}
                        <a-button
                          type="dashed"
                          block
                          icon="plus"
                          onClick={() => {
                            this.apiForm.body.push({
                              key: '',
                              value: '',
                            });
                          }}
                        ></a-button>
                      </a-form-model-item>
                      <a-form-model-item
                        scopedSlots={{
                          label: () => {
                            return (
                              <span>
                                请求拦截器
                                <a-tooltip title="必须返回配置信息">
                                  <a-icon
                                    type="question-circle-o"
                                    style="color: rgba(0,0,0,.45); position: relative; top: 1px; margin-left: 4px"
                                  />
                                </a-tooltip>
                              </span>
                            );
                          },
                        }}
                      >
                        <div>
                          (config:{' '}
                          <a-tooltip
                            scopedSlots={{
                              title: () => {
                                return [
                                  <div>{'type RequestConfigInterface = {'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求地址'}</div>,
                                  <div>&nbsp;&nbsp;{'url: string;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求参数'}</div>,
                                  <div>&nbsp;&nbsp;{'params: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求体'}</div>,
                                  <div>&nbsp;&nbsp;{'data: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求头'}</div>,
                                  <div>&nbsp;&nbsp;{'headers: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求方法'}</div>,
                                  <div>&nbsp;&nbsp;{'method: string;'}</div>,
                                  <div>{'}'}</div>,
                                ];
                              },
                            }}
                          >
                            <span style="color: rgb(86, 182, 194);">RequestConfigInterface</span>
                          </a-tooltip>
                          ): <span style="color: rgb(86, 182, 194);">RequestConfigInterface</span> =
                          {'> {'}
                        </div>
                        <CustomEditor
                          height="200"
                          value={this.apiForm.requestInterceptor}
                          onChange={(value: string) => {
                            this.apiForm.requestInterceptor = value;
                          }}
                          lang="javascript"
                        ></CustomEditor>
                        <div>{'}'}</div>
                      </a-form-model-item>
                      <a-form-model-item
                        scopedSlots={{
                          label: () => {
                            return (
                              <span>
                                响应拦截器
                                <a-tooltip title="必须返回响应信息">
                                  <a-icon
                                    type="question-circle-o"
                                    style="color: rgba(0,0,0,.45); position: relative; top: 1px; margin-left: 4px"
                                  />
                                </a-tooltip>
                              </span>
                            );
                          },
                        }}
                      >
                        <div>
                          (response:{' '}
                          <a-tooltip
                            scopedSlots={{
                              title: () => {
                                return [
                                  <div>{'type ResponseInterface = {'}</div>,
                                  <div>&nbsp;&nbsp;{'// 业务响应数据'}</div>,
                                  <div>&nbsp;&nbsp;{'data: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 状态码'}</div>,
                                  <div>&nbsp;&nbsp;{'status: number;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 状态文本信息'}</div>,
                                  <div>&nbsp;&nbsp;{'statusText: string;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 响应头信息'}</div>,
                                  <div>&nbsp;&nbsp;{'headers: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求配置信息'}</div>,
                                  <div>&nbsp;&nbsp;{'config: RequestConfigInterface;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求实例对象'}</div>,
                                  <div>&nbsp;&nbsp;{'request: any;'}</div>,
                                  <div>{'}'}</div>,
                                ];
                              },
                            }}
                          >
                            <span style="color: rgb(86, 182, 194);">ResponseInterface</span>
                          </a-tooltip>
                          ): <span style="color: rgb(86, 182, 194);">any</span> ={'> {'}
                        </div>
                        <CustomEditor
                          height="200"
                          value={this.apiForm.responseInterceptor}
                          onChange={(value: string) => {
                            this.apiForm.responseInterceptor = value;
                          }}
                          lang="javascript"
                        ></CustomEditor>
                        <div>{'}'}</div>
                      </a-form-model-item>
                      <a-form-model-item label="错误处理">
                        {/* <div>(error) ={'> {'}</div> */}
                        <div>
                          (error:{' '}
                          <a-tooltip
                            scopedSlots={{
                              title: () => {
                                return [
                                  <div>{'type ErrorInterface = {'}</div>,
                                  <div>&nbsp;&nbsp;{'// 响应实例对象'}</div>,
                                  <div>&nbsp;&nbsp;{'response?: any;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 请求实例对象'}</div>,
                                  <div>&nbsp;&nbsp;{'request?: any;'}</div>,
                                  <div>{'}'}</div>,
                                ];
                              },
                            }}
                          >
                            <span style="color: rgb(86, 182, 194);">ErrorInterface</span>
                          </a-tooltip>
                          ) ={'> {'}
                        </div>
                        <CustomEditor
                          height="200"
                          onChange={(value: string) => {
                            this.apiForm.error = value;
                          }}
                          value={this.apiForm.error}
                          lang="javascript"
                        ></CustomEditor>
                        <div>{'}'}</div>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-col>
              </a-row>
            )}
          </div>
        </a-modal>

        {/* 生命周期 */}
        <a-modal
          vModel={this.lifecyclesModalVisible}
          title="生命周期"
          centered
          bodyStyle={{ backgroundColor: '#f0f2f5' }}
          keyboard={false}
          maskClosable={false}
          getContainer={() => {
            return document.querySelector('.form-model-config-wrapper');
          }}
          width={1000}
          onOk={() => {
            this.data.lifecycles = this.lifecycles;
            this.lifecyclesModalVisible = false;
          }}
          onCancel={() => {
            this.selectedLifecycles = 0;
          }}
        >
          <div style="min-height: 500px">
            <a-alert
              message="每个生命周期即为一个函数，且响应体中只能书写原生JavaScript代码，如果为空，将不执行，反之亦然"
              type="info"
              show-icon
              style="margin-bottom: 10px;"
            />
            {this.lifecycles.length > 0 && (
              <a-row type="flex" gutter={10} class="form-model-config" style="height: 450px;">
                <a-col span={8}>
                  <div class="form-model-config-left">
                    {this.lifecycles.map((item, index) => {
                      return (
                        <div
                          class={{
                            'form-model-config-left-item': true,
                            selected: index === this.selectedLifecycles,
                          }}
                          onClick={() => {
                            this.selectedLifecycles = index;
                            this.lifecyclesForm = this.lifecycles[index];
                          }}
                        >
                          <span class="form-model-config-left-item-text">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </a-col>
                <a-col span={16}>
                  <div class="form-model-config-right">
                    <a-form-model
                      props={{ model: this.lifecyclesForm }}
                      label-col={{ span: 4 }}
                      wrapper-col={{ span: 20 }}
                    >
                      <a-form-model-item label="名称" prop="name">
                        <a-input vModel={this.lifecyclesForm.name} disabled>
                          <a-tooltip
                            placement="left"
                            slot="suffix"
                            title="生命周期函数为内置函数，不可修改函数名"
                          >
                            <a-icon type="question-circle-o" style="color: rgba(0,0,0,.45)" />
                          </a-tooltip>
                        </a-input>
                      </a-form-model-item>
                      <a-form-model-item label="响应体">
                        <div>
                          (data:{' '}
                          <a-tooltip
                            scopedSlots={{
                              title: () => {
                                return [
                                  <div>{'type DataInterface = {'}</div>,
                                  <div>&nbsp;&nbsp;{'// 表单整体数据对象'}</div>,
                                  <div>&nbsp;&nbsp;{'model: Object;'}</div>,
                                  <div>&nbsp;&nbsp;{'// 日期插件'}</div>,
                                  <div>&nbsp;&nbsp;{'dayjs: Dayjs;'}</div>,
                                  <div>{'}'}</div>,
                                ];
                              },
                            }}
                          >
                            <span style="color: rgb(86, 182, 194);">DataInterface</span>
                          </a-tooltip>
                          ) ={'> {'}
                        </div>
                        <CustomEditor
                          height="200"
                          onChange={(value: string) => {
                            this.lifecyclesForm.body = value;
                          }}
                          value={this.lifecyclesForm.body}
                          lang="javascript"
                        ></CustomEditor>
                        <div>{'}'}</div>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-col>
              </a-row>
            )}
          </div>
        </a-modal>
      </div>
    );
  }
}
