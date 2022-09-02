import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { createHash } from '../../../../../utils/format';
import CustomEditor from '../../../../CustomEditor';
import { ValidatorInterface } from '../../../../../Models/Widget/input';
import ControlCenter from '../../../../ControlCenter';
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

  @Inject('generateComponentList')
  generateComponentList!: (filterNode?: string[]) => any[];

  @Watch('select')
  private dataChangeHandle() {
    this.drawerVisible = false;
  }

  // 校验规则列表
  private rules = [
    { value: 'url', label: 'URL地址' },
    { value: 'email', label: '邮箱格式' },
    { value: 'number', label: '数字' },
    { value: 'integer', label: '整数格式' },
    { value: 'idcard', label: '身份证格式' },
    { value: 'phone', label: '手机号格式' },
    { value: 'zh', label: '中文格式' },
    { value: 'zip', label: '邮编格式' },
  ];

  // 缓存字段属性配置
  get fieldProperties() {
    return this.select.fieldProperties;
  }

  // 自定义格式化函数显示状态
  private customFuncVisible = false;

  // 是否显示受控中心弹窗
  private controlVisible = false;

  // 校验规则折叠箭头角度
  private rotate = 0;

  // 当前所在编辑的高级校验配置对象
  private currentCheckRule: ValidatorInterface | any = {};

  // 组件列表数据
  private componentList: any[] = [];

  // 是否显示高级校验配置抽屉
  private drawerVisible = false;

  $refs!: {
    expression: CustomEditor;
  };

  render() {
    return (
      <div>
        <a-form-model
          props={{ model: this.fieldProperties }}
          label-col={{ span: 9 }}
          wrapper-col={{ span: 14, offset: 1 }}
          labelAlign="left"
        >
          <a-form-model-item
            label="字段标识"
            prop="name"
            key={this.select.key}
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
            <a-input vModel={this.fieldProperties.name} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="标题">
            <a-input vModel={this.fieldProperties.title} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="标题国际化标识">
            <a-input vModel={this.fieldProperties.titleLangKey} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-textarea autoSize vModel={this.fieldProperties.description} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="描述国际化标识">
            <a-input vModel={this.fieldProperties.descriptionLangKey} placeholder="请输入" />
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
            <a-select vModel={this.fieldProperties.display}>
              <a-select-option value="visible">显示</a-select-option>
              <a-select-option value="hidden">半隐藏</a-select-option>
              <a-select-option value="none">全隐藏</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="UI形态">
            <a-select vModel={this.fieldProperties.pattern}>
              <a-select-option value="editable">可编辑</a-select-option>
              <a-select-option value="disabled">禁用</a-select-option>
              <a-select-option value="readOnly">只读</a-select-option>
              <a-select-option value="readPretty">阅读</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip
                    placement="left"
                    title='阅读模式下数据格式化函数，格式: (value) => { return "string"}'
                  >
                    格式化函数
                  </a-tooltip>
                );
              },
            }}
          >
            <a-popover
              trigger="click"
              placement="bottomRight"
              arrow-point-at-center
              visible={this.customFuncVisible}
              onVisibleChange={(visible: boolean) => {
                this.customFuncVisible = visible;
                if (!visible) {
                  this.fieldProperties.valueFormatter = this.$refs.expression.getValue();
                }
              }}
              scopedSlots={{
                content: () => {
                  return (
                    <div style="width: 300px">
                      <CustomEditor
                        height="200"
                        theme="chrome"
                        ref="expression"
                        value={this.fieldProperties.valueFormatter}
                        lang="javascript"
                      ></CustomEditor>
                    </div>
                  );
                },
              }}
            >
              <a-button block>表达式</a-button>
            </a-popover>
          </a-form-model-item>
          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip
                    placement="left"
                    title="默认值：指控件初始值，数据类型为 number | number[]，在配置层表达式提供json字符串来表示，在应用层会将json字符串转换成实际数据类型"
                  >
                    默认值
                  </a-tooltip>
                );
              },
            }}
          >
            <DataTypeSwitch
              dataType={this.fieldProperties.defaultValue.dataType}
              values={this.fieldProperties.defaultValue.value}
              types={['number', 'expression']}
              on={{
                ['update:dataType']: (newType: string) => {
                  this.fieldProperties.defaultValue.dataType = newType;
                },
                change: (value: string) => {
                  this.fieldProperties.defaultValue.value = value;
                },
              }}
            />
          </a-form-model-item>
          <a-form-model-item label="必填">
            <a-switch vModel={this.fieldProperties.required} />
          </a-form-model-item>
          <a-form-model-item label="必填错误消息">
            <a-input vModel={this.fieldProperties.requiredMessage} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="必填消息国际化标识">
            <a-input vModel={this.fieldProperties.requiredMessageLangKey} placeholder="请输入" />
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
                    <span>校验规则</span>
                  </span>
                );
              },
            }}
          >
            {Array.isArray(this.fieldProperties.validator) ? (
              <a-select
                allowClear
                placeholder="请选择"
                onChange={(value: string) => {
                  this.fieldProperties.validator = value;
                }}
                options={this.rules}
              ></a-select>
            ) : (
              <a-select
                vModel={this.fieldProperties.validator}
                key="default"
                allowClear
                placeholder="请选择"
                options={this.rules}
              ></a-select>
            )}
          </a-form-model-item>
          {this.rotate === 90 && (
            <div class="property-config-wrapper__check-rule-advance">
              {Array.isArray(this.fieldProperties.validator) && (
                <Draggable
                  vModel={this.fieldProperties.validator}
                  ghostClass="ghost"
                  animation={200}
                  handle=".drag-handle"
                  move={(e: any) => {
                    return true;
                  }}
                >
                  <transition-group name="fade" tag="div">
                    {this.fieldProperties.validator.map(
                      (
                        item: ValidatorInterface & {
                          key: string;
                        },
                        index: number,
                      ) => {
                        return (
                          <div
                            class="property-config-wrapper__check-rule-advance-item"
                            key={item.key}
                          >
                            <a-row type="flex" justify="center" align="middle">
                              <a-col span={3}>
                                <a-icon type="menu" style="cursor: move" class="drag-handle" />
                              </a-col>
                              <a-col span={12}>
                                <a-button
                                  onClick={() => {
                                    this.currentCheckRule = this.fieldProperties.validator[index];

                                    this.componentList = this.generateComponentList([
                                      this.select.key,
                                    ]);
                                    this.drawerVisible = true;
                                  }}
                                >
                                  配置规则
                                </a-button>
                              </a-col>
                              <a-col span={3}>
                                <a-icon
                                  type="up"
                                  onClick={() => {
                                    const temp = this.fieldProperties.validator;
                                    if (temp.length === 1 || index === 0) return;

                                    temp.splice(
                                      index - 1,
                                      1,
                                      ...temp.splice(index, 1, temp[index - 1]),
                                    );
                                  }}
                                />
                              </a-col>
                              <a-col span={3}>
                                <a-icon
                                  type="down"
                                  onClick={() => {
                                    const temp = this.fieldProperties.validator;
                                    if (temp.length === index + 1) return;
                                    temp.splice(
                                      index,
                                      1,
                                      ...temp.splice(index + 1, 1, temp[index]),
                                    );
                                  }}
                                />
                              </a-col>
                              <a-col span={3}>
                                <a-icon
                                  type="delete"
                                  onClick={() => {
                                    this.fieldProperties.validator.splice(index, 1);
                                  }}
                                />
                              </a-col>
                            </a-row>
                          </div>
                        );
                      },
                    )}
                  </transition-group>
                </Draggable>
              )}
              <a-button
                type="dashed"
                block
                icon="plus"
                onClick={() => {
                  if (!Array.isArray(this.fieldProperties.validator)) {
                    this.$set(this.fieldProperties, 'validator', []);
                  }

                  this.fieldProperties.validator.push({
                    key: createHash(12),
                    strategy: 'self',
                    triggerType: 'change',
                    driveList: [],
                    rangeRuleList: [
                      {
                        fieldName: '',
                        condition: '',
                        target: null,
                        unit: '',
                        message: '',
                        messageLangKey: '',
                      },
                    ],
                    validator: '',
                    message: '',
                    messageLangKey: '',
                    format: undefined,
                    pattern: '',
                    len: null,
                    max: null,
                    min: null,
                    exclusiveMaximum: null,
                    exclusiveMinimum: null,
                    whitespace: false,
                  });
                }}
              >
                添加校验规则
              </a-button>
            </div>
          )}
          {!Array.isArray(this.fieldProperties.validator) && [
            <a-form-model-item label="类型错误消息">
              <a-input vModel={this.fieldProperties.typeErrorMessage} placeholder="请输入" />
            </a-form-model-item>,
            <a-form-model-item label="类型错误消息国际化标识">
              <a-input vModel={this.fieldProperties.typeErrorMessageLangKey} placeholder="请输入" />
            </a-form-model-item>,
          ]}
        </a-form-model>

        {/* 受控中心配置 */}
        {this.controlVisible && (
          <ControlCenter
            data={this.fieldProperties.reactions}
            id={this.select.key}
            onConfirm={(data: any) => {
              this.fieldProperties.reactions = data;
              this.controlVisible = false;
            }}
            onCancel={() => {
              this.controlVisible = false;
            }}
          />
        )}

        {/* 高级校验规则抽屉 */}
        <a-drawer
          placement="right"
          closable={false}
          keyboard={false}
          getContainer={() => {
            return document.querySelector('.property-config-wrapper');
          }}
          destroyOnClose
          width="250px"
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
            {this.currentCheckRule && (
              <a-form-model
                label-col={{ span: 9 }}
                wrapper-col={{ span: 14, offset: 1 }}
                labelAlign="left"
              >
                <a-form-model-item label="触发类型">
                  <a-select vModel={this.currentCheckRule.triggerType} placeholder="请选择">
                    <a-select-option value="change">改变时</a-select-option>
                    <a-select-option value="blur">失焦时</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="校验策略">
                  <a-select vModel={this.currentCheckRule.strategy}>
                    <a-select-option value="self">自身校验</a-select-option>
                    <a-select-option value="drive">驱动校验</a-select-option>
                    {/* <a-select-option value="range">范围校验</a-select-option> */}
                  </a-select>
                </a-form-model-item>

                {this.currentCheckRule.strategy === 'drive' && (
                  <a-form-model-item label="驱动校验字段">
                    <a-select
                      vModel={this.currentCheckRule.driveList}
                      placeholder="请选择"
                      optionFilterProp="title"
                      allowClear
                      mode="multiple"
                      options={this.componentList}
                    ></a-select>
                  </a-form-model-item>
                )}

                {this.currentCheckRule.strategy === 'self' && [
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title='自定义校验器：格式: (dayjs, getLangResult, models, directModels, path) => { return (rule, value, callback) => { callback("错误消息") } }'
                          >
                            自定义校验器
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-popover
                      trigger="click"
                      placement="bottomRight"
                      arrow-point-at-center
                      scopedSlots={{
                        content: () => {
                          return (
                            <div style="width: 300px">
                              <CustomEditor
                                height="200"
                                theme="chrome"
                                onChange={(value: string) => {
                                  this.currentCheckRule.validator = value;
                                }}
                                value={this.currentCheckRule.validator}
                                lang="javascript"
                              ></CustomEditor>
                            </div>
                          );
                        },
                      }}
                    >
                      <a-button block>表达式</a-button>
                    </a-popover>
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="错误消息只对当前规则集的一个内置规则生效，如果需要对不同内置规则定制错误消息，请拆分成多条规则"
                          >
                            错误消息
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input vModel={this.currentCheckRule.message} />
                  </a-form-model-item>,
                  <a-form-model-item label="错误消息国际化标识">
                    <a-input vModel={this.currentCheckRule.messageLangKey} />
                  </a-form-model-item>,
                  <a-form-model-item label="格式校验">
                    <a-select
                      allowClear
                      vModel={this.currentCheckRule.format}
                      placeholder="请选择"
                      onChange={(value: string) => {
                        this.currentCheckRule.format = value;
                      }}
                      options={this.rules}
                    ></a-select>
                  </a-form-model-item>,
                  <a-form-model-item label="正则表达式">
                    <a-input prefix="/" suffix="/" vModel={this.currentCheckRule.pattern} />
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="【长度限制】：字符的长度或者数值要等于此值，如果不想校验此规则，可删除其值"
                          >
                            长度限制
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input-number vModel={this.currentCheckRule.len} style="width: 100%" />
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="【长度/数值小于】：字符的长度或者数值要小于此值，如果不想校验此规则，可删除其值"
                          >
                            长度/数值小于
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input-number vModel={this.currentCheckRule.max} style="width: 100%" />
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="【长度/数值大于】：字符的长度或者数值要大于此值，如果不想校验此规则，可删除其值"
                          >
                            长度/数值大于
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input-number vModel={this.currentCheckRule.min} style="width: 100%" />
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="【长度/数值小于等于】：字符的长度或者数值要小于等于此值，如果不想校验此规则，可删除其值"
                          >
                            长度/数值小于等于
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input-number
                      vModel={this.currentCheckRule.exclusiveMaximum}
                      style="width: 100%"
                    />
                  </a-form-model-item>,
                  <a-form-model-item
                    scopedSlots={{
                      label: () => {
                        return (
                          <a-tooltip
                            placement="left"
                            title="【长度/数值大于等于】：字符的长度或者数值要大于等于此值，如果不想校验此规则，可删除其值"
                          >
                            长度/数值大于等于
                          </a-tooltip>
                        );
                      },
                    }}
                  >
                    <a-input-number
                      vModel={this.currentCheckRule.exclusiveMinimum}
                      style="width: 100%"
                    />
                  </a-form-model-item>,
                ]}

                <a-form-model-item
                  label="不允许有空格"
                  labelCol={{ span: 14 }}
                  wrapperCol={{ span: 9, offset: 1 }}
                >
                  <a-switch vModel={this.currentCheckRule.whitespace} />
                </a-form-model-item>
              </a-form-model>
            )}
          </div>
        </a-drawer>
      </div>
    );
  }
}
