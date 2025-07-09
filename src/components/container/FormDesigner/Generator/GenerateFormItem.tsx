import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import TimePickerRange from '@/components/container/TimePickerRange';
import uniqby from 'lodash.uniqby';

@Component
export default class GenerateFormItem extends Vue {
  /**
   * 单个控件配置信息
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  widget!: any;

  /**
   * 过滤表单项
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  filterKeys!: Array<string>;

  /**
   * 整个form表单数据模型，但是在此处只会用到一个key，因为这个是单个控件，为了做数据绑定
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  models!: any;

  /**
   * 初始化时的原始数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: any;

  /**
   * 整个form表单数据验证模型
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  rules!: any;

  /**
   * 远端数据操作方法
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: Record<string, any>;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  /**
   * form表单最外层配置
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  globalConfig!: any;

  /**
   * 表单控件是否以文本方式展示
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  type!: boolean;

  private current = this.models[this.widget.model]; // 当前字段值
  private treeObj = {
    value: this.models[this.widget.model],
    label: this.widget.options.assistField ? this.models[this.widget.options.assistField] : '',
  }; // 懒加载树绑定值 - 单个
  private treeList: any[] = []; // 懒加载树绑定值 - 多个
  private userVisible = false; // 是否显示人员选择器
  private options: any[] = []; // 人员选择器临时存储对象
  private previewVisible = false; // 是否显示附件预览
  private treeShowName = ''; // 树懒加载查询搜索字段
  private selectObj: any = {
    label: this.widget.options.assistField ? this.models[this.widget.options.assistField] : '',
    key: this.models[this.widget.model],
    type: '',
  }; // 查询组件懒加载绑定值
  private treeTypes: any = {}; // 查询组件懒加载绑定值
  $refs!: {
    selector: any;
  };

  @Watch('models', { deep: true })
  private modelsChange(newVal: any) {
    this.current = newVal[this.widget.model];

    // console.log('biaodan', JSON.parse(JSON.stringify(newVal)));
    if (
      !(
        newVal[this.widget.options.assistField] == undefined ||
        newVal[this.widget.options.assistField] == null
      )
    ) {
      this.treeObj.label = this.widget.options.assistField
        ? newVal[this.widget.options.assistField]
        : '';
    }

    this.treeObj.value = newVal[this.widget.model];
    if (this.selectObj) {
      this.selectObj.key = newVal[this.widget.model];
      this.selectObj.label = this.widget.options.assistField
        ? newVal[this.widget.options.assistField]
        : '';
    }
  }

  @Emit('checked')
  private emitChecked(field: string) { }

  @Emit('update:models')
  protected updateModels(val: any) { }

  @Emit('inputChange')
  private emitInputChange(val: any, key: string) { }

  // 过滤当前字段是否在过滤列表中
  get filterKeysState() {
    return this.filterKeys.includes(this.widget.model);
  }

  /**
   * 监听当前字段值
   * @param newVal 新值
   */
  @Watch('current', { deep: true })
  private currentChange(newVal: any) {
    // console.log('监听进来', newVal);
    this.models[this.widget.model] = newVal;
    this.treeObj.value = newVal;
    this.updateModels({
      ...this.models,
      [this.widget.model]: newVal,
    });

    const ids = setTimeout(() => {
      this.emitChecked(this.widget.model);
      clearTimeout(ids);
    }, 200);

    this.emitInputChange(newVal, this.widget.model);
  }

  private treeSelected: any = []; // 下拉树选中的需要显示的节点名称
  private cascaderSelected = '';
  private imgViewObj: any = {
    visible: false,
    url: '',
  }; // 图片预览 - 只读模式

  created() {
    this.excuteOption();
    // console.log('初始化fff', this.remote);
  }

  excuteOption() {
    /**
     * 处理当前字段是否需要远端数据，如果有在组件调用时，将执行远端方法请求数据并赋值到远端选项中去
     * 特殊处理阿里云文件上传token
     */
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data: any) => {
        if (this.widget.type === 'treeSelect' && !this.widget.options.asyncLoad) {
          this.widget.options.remoteOptions = data;

          if (this.widget.options.assistField !== '') {
            this.treeSelected = this.value[this.widget.options.assistField];
            this.treeObj.label = this.value[this.widget.options.assistField];
          }
        } else if (this.widget.type === 'html') {
          this.current = data;
        } else if (this.widget.type === 'cascader') {
          this.widget.options.remoteOptions = data;

          if (this.widget.options.assistField !== '') {
            this.cascaderSelected = this.value[this.widget.options.assistField].join('/');
          }
        } else {
          this.widget.options.remoteOptions =
            this.widget.type === 'inputSelect'
              ? data
              : data.map((item: any) => {
                return {
                  id: item[this.widget.options.props.value],
                  key: item[this.widget.options.props.value],
                  value: item[this.widget.options.props.value],
                  label: item[this.widget.options.props.label],
                  children: item[this.widget.options.props.children],
                };
              });
        }
        // 树懒加载
        if (this.widget.type === 'treeSelect' && this.widget.options.asyncLoad) {
          if (this.widget.options.assistField !== '') {
            if (this.widget.options.multiple) {
              const ids = this.models[this.widget.model] || [];
              const test = this.widget.options.assistField
                ? this.value[this.widget.options.assistField] || []
                : [];
              ids.map((r: string, idx: number) => {
                this.treeList.push({
                  value: r,
                  label: test[idx] || '',
                });
              });
              this.treeSelected = test;
              // console.log('树2', JSON.parse(JSON.stringify(this.treeList)));
            } else {
              this.treeObj.label = this.value[this.widget.options.assistField];
              this.treeSelected = this.value[this.widget.options.assistField];
              // console.log('树', JSON.parse(JSON.stringify(this.treeObj)));
            }
          }
        }
        // 查询下拉
        if (this.widget.type === 'inputSelect') {
          if (this.widget.options.assistField !== '') {
            if (this.widget.options.multiple) {
              const ids = this.models[this.widget.model] || [];
              const test = this.widget.options.assistField
                ? this.value[this.widget.options.assistField] || []
                : [];
              ids.map((r: string, idx: number) => {
                this.treeList.push({
                  value: r,
                  key: r,
                  label: test[idx] || '',
                });
              });
              this.treeSelected = test;
              this.models[this.widget.options.assistField] = test;
              // console.log('inputSelect', JSON.parse(JSON.stringify(this.treeList)));
            } else {
              console.log(
                'inputSelect',
                this.widget.options.assistField,
                this.value,
                this.widget.options.placeholder,
              );
              if (this.value[this.widget.options.assistField]) {
                this.selectObj.label = this.value[this.widget.options.assistField];
                this.treeSelected = this.value[this.widget.options.assistField];
                this.models[this.widget.options.assistField] = this.selectObj.label;
                this.selectObj.key = this.value[this.widget.model];
              } else {
                this.selectObj = undefined;
              }
              //
            }
          }
        }
      });
    }

    if (this.widget.type === 'customSelector' && this.current) {
      this.options = this.widget.options.multiple
        ? JSON.parse(JSON.stringify(this.current))
        : JSON.parse(JSON.stringify([this.current]));
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isAliyun) {
      this.remote[this.widget.options.tokenFunc]((data: any) => {
        this.widget.options.token = data;
      });
    }
  }

  /**
   * 下拉树懒加载方法
   * @param treeNode
   */
  treeSelectLoad(treeNode: any, r: any, value: string) {
    return new Promise((resolve: Function) => {
      const nodeRef = treeNode.dataRef;// 已有数据则跳过 
      if (nodeRef) {
        if (nodeRef.children?.length || nodeRef.isLoaded) {
          resolve();
          return;
        }
      }
      this.remote[this.widget.options.remoteFunc](
        (data: any) => {
          const temp = data.map((item: any) => {
            return {
              id: item[this.widget.options.props.value],
              pId: treeNode ? (treeNode.dataRef ? treeNode.dataRef.id : '') : '',
              key: item[this.widget.options.props.value],
              value: item[this.widget.options.props.value],
              label: item[this.widget.options.props.label],
              children: item[this.widget.options.props.children],
              isLeaf: item.isLeaf,
            };
          });
          if (value) {
            r.remoteOptions = temp;
          } else {
            if (treeNode.dataRef) {
              treeNode.dataRef.children = temp;
            } else {
              r.remoteOptions = temp;
            }
          }
          // this.widget.options.remoteOptions = this.widget.options.remoteOptions.concat(temp);
          resolve();
        },
        treeNode,
        value,
      );
    });
  }
  /**
   * 下拉数据远端搜索
   */
  selectLoad(value: any) {
    return new Promise((resolve: Function) => {
      this.remote[this.widget.options.remoteFunc]((data: any) => {
        this.widget.options.remoteOptions = data.map((item: any) => {
          return {
            id: item[this.widget.options.props.value],
            key: item[this.widget.options.props.value],
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children],
          };
        });
        resolve();
      }, value);
    });
  }
  /**
   * 查询下拉数据远端搜索
   */
  inputLoad(value: any) {
    return new Promise((resolve: Function) => {
      this.remote[this.widget.options.remoteFunc]((data: any) => {
        this.widget.options.remoteOptions = data;
        resolve();
      }, value);
    });
  }
  findNodeByKey(nodes: Array<any>) {
    return nodes.map(node => {
      const newNode = {
        ...node,
      };
      return newNode;
    });
  }
  /**
   * 下拉数据选项进行搜索
   */
  selectfilterOption(input: any, option: any) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /**
   * 受控时所需要的条件
   * @param obj 条件函数
   * @param data 响应式model对象
   * @param value 传输的原始数据对象
   * @returns 状态
   */
  executeStr(obj: string, data: any, value: any) {
    try {
      return Function('"use strict";return (' + obj + ')')()(data, value);
    } catch {
      console.log('报错', JSON.parse(JSON.stringify(obj)))
    }
  }

  /**
   * 自定义字符转换器
   */
  valueTransform(obj: string, value: string) {
    return Function('"use strict";return (' + obj + ')')()(value);
  }

  render() {
    const widget = this.widget;
    const widgetType = widget.type;
    const loadAntd = (type: boolean) => {
      switch (type) {
        case false:
          return (
            <a-select
              show-search
              v-model={this.selectObj}
              placeholder={this.$t(widget.options.placeholder)}
              style={{ width: widget.options.width }}
              default-active-first-option={false}
              // show-arrow={false}
              filter-option={false}
              labelInValue
              allowClear={widget.options.clearable}
              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
              option-label-prop="label"
              onSearch={this.inputLoad}
              on-select={(value: any) => {
                if (this.selectObj) {
                  if (this.selectObj.key) {
                    this.treeSelected = this.selectObj.label;
                    this.models[this.widget.model] = this.selectObj.key;
                    this.current = this.selectObj.key;
                    if (this.widget.options.assistField) {
                      this.models[this.widget.options.assistField] = this.selectObj.label;
                    }
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }
                }
              }}
              on-change={(value: any) => {
                if (!value) {
                  if (this.selectObj) {
                    this.selectObj.label = '';
                    this.selectObj.key = '';
                    this.treeSelected = this.selectObj.label;
                    this.models[this.widget.model] = this.selectObj.key;
                    this.current = this.selectObj.key;
                    if (this.widget.options.assistField) {
                      this.models[this.widget.options.assistField] = this.selectObj.label;
                    }
                  } else {
                    this.models[this.widget.model] = '';
                    this.current = '';
                    if (this.widget.options.assistField) {
                      this.models[this.widget.options.assistField] = '';
                    }
                  }

                  (this.$refs as any)[widget.model].onFieldChange();

                  if (this.remote[widget.options.onchange]) {
                    this.remote[widget.options.onchange](this.current, this.models, this.value);
                  }
                }
              }}
            >
              {(widget.options.remoteOptions || []).map((item: any) => {
                return (
                  <a-select-option
                    disabled={item.disabled}
                    key={item[widget.options.props.value]}
                    value={item[widget.options.props.value]}
                    label={item[widget.options.props.label]}
                  >
                    <p class={{ orgitem: true, disabled: item.disabled }} title={item.description}>
                      <span class="orgitem-text">
                        {item.name}
                        <font>({item.code})</font>
                      </span>
                      <font class="layer">{item.description}</font>
                    </p>
                  </a-select-option>
                );
              })}
            </a-select>
          );
        default:
          return (
            <a-select
              show-search
              mode="multiple"
              style={{ width: widget.options.width }}
              v-model={this.treeList}
              placeholder={this.$t(widget.options.placeholder)}
              default-active-first-option={false}
              show-arrow={true}
              filter-option={false}
              labelInValue
              maxTagCount={1}
              allowClear={widget.options.clearable}
              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
              option-label-prop="label"
              onSearch={this.inputLoad}
              on-select={(value: any) => {
                this.treeList.map((r: any) => {
                  r.type = this.treeTypes[r.key];
                  r.value = r.key;
                });
              }}
              on-deselect={() => {
                // this.handleCallback();
              }}
              on-change={(value: any) => {
                this.treeSelected = this.treeList.map((o: any) => o.label);
                // this.treeObj.label = extra.triggerNode.label;
                this.models[this.widget.model] = this.treeList.map((o: any) => o.key);
                this.current = this.treeList.map((o: any) => o.key);
                if (this.widget.options.assistField) {
                  this.models[this.widget.options.assistField] = this.treeSelected;
                }
                (this.$refs as any)[widget.model].onFieldChange();

                if (this.remote[widget.options.onchange]) {
                  this.remote[widget.options.onchange](this.current, this.models, this.value);
                }
              }}
            >
              {(widget.options.remoteOptions || []).map((item: any) => {
                return (
                  <a-select-option
                    disabled={item.disabled}
                    key={item[widget.options.props.value]}
                    value={item[widget.options.props.value]}
                    label={item[widget.options.props.label]}
                  >
                    <p class={{ orgitem: true, disabled: item.disabled }} title={item.description}>
                      <span class="orgitem-text">
                        {item.name}
                        <font>({item.code})</font>
                      </span>
                      <font class="layer">{item.description}</font>
                    </p>
                  </a-select-option>
                );
              })}
            </a-select>
          );
      }
    };
    const temp = () => {
      return (
        <a-form-model-item
          label={widget.type == 'button' ? null : this.$t(widget.name)}
          prop={widget.model}
          ref={widget.model}
          autoLink={false}
          props={
            widget.options.labelControl
              ? {
                labelCol: { span: widget.options.labelCol },
                wrapperCol: { span: 24 - widget.options.labelCol },
              }
              : null
          }
        >
          {this.type ? (
            <div>
              {widgetType == 'input' || widgetType == 'textarea' || widgetType == 'text' ? (
                <span>
                  {widget.options.valueFormatter && widget.options.valueFormatter.trim() !== ''
                    ? this.valueTransform(widget.options.valueFormatter.trim(), this.current)
                    : this.current}
                </span>
              ) : null}

              {widgetType == 'time' || widgetType == 'date' || widgetType == 'number' ? (
                <span>{Array.isArray(this.current) ? this.current.join(',') : this.current}</span>
              ) : null}

              {widgetType == 'switch'
                ? this.current
                  ? this.$t('pageDesign.action.yes')
                  : this.$t('pageDesign.action.no')
                : null}
              {widgetType == 'radio'
                ? (widget.options.remote
                  ? widget.options.remoteOptions
                  : widget.options.options
                ).find((item: any) => item.value == this.current)?.label
                : null}
              {widgetType == 'checkbox' || widgetType == 'select'
                ? (widget.options.remote ? widget.options.remoteOptions : widget.options.options)
                  .filter((item: any) => {
                    if (Array.isArray(this.current)) {
                      return this.current.includes(item.value);
                    } else {
                      return this.current === item.value;
                    }
                  })
                  .map((sub: any) => sub.label)
                  .join(',')
                : null}

              {widgetType == 'treeSelect'
                ? widget.options.multiple
                  ? this.treeSelected.join(',')
                  : this.treeSelected
                : null}

              {widgetType == 'cascader' && this.cascaderSelected}

              {widgetType == 'customSelector'
                ? this.current.map((item: any) => item.label).join(',')
                : null}
              {widgetType == 'ddList' ? this.current.map((item: any) => item.name).join(',') : null}
              {widgetType == 'imgupload' &&
                this.current &&
                this.current.map((item: any) => {
                  return (
                    <span style="margin-right: 10px;">
                      <img
                        alt={item.name}
                        src={item.url}
                        style="width: 100px; display: block; cursor: pointer;"
                        onClick={() => {
                          this.imgViewObj.visible = true;
                          this.imgViewObj.url = item.url;
                        }}
                      />
                      <a-icon type="paper-clip" style="margin-right: 5px;" />
                      <a target="_blank" href={item.url}>
                        {item.name}
                      </a>
                    </span>
                  );
                })}
              <a-modal
                visible={this.imgViewObj.visible}
                footer={null}
                title="预览"
                wrapClassName="component-pop-upload-preview"
                onCancel={() => {
                  this.imgViewObj.visible = false;
                }}
              >
                <a-carousel
                  arrows
                  scopedSlots={{
                    prevArrow: (props: any) => {
                      return (
                        <div class="custom-slick-arrow" style="left: 10px; z-index: 1;">
                          <a-icon type="left-circle" />
                        </div>
                      );
                    },
                    nextArrow: (props: any) => {
                      return (
                        <div class="custom-slick-arrow" style="right: 10px">
                          <a-icon type="right-circle" />
                        </div>
                      );
                    },
                  }}
                >
                  <div style="height: 200px;">
                    <img
                      src={this.imgViewObj.url}
                      style="object-fit: scale-down; width: 100%; height: 100%;"
                    />
                  </div>
                </a-carousel>
              </a-modal>
            </div>
          ) : (
            <div>
              {widget.type == 'input' &&
                (widget.options.dataType == 'number' ||
                  widget.options.dataType == 'integer' ||
                  widget.options.dataType == 'float' ? (
                  <a-input-number
                    vModel={this.current}
                    placeholder={this.$t(widget.options.placeholder)}
                    style={{ width: widget.options.width }}
                    disabled={widget.options.disabled}
                    size={this.globalConfig.size}
                    onBlur={() => {
                      (this.$refs as any)[widget.model].onFieldBlur();
                    }}
                    onChange={() => {
                      (this.$refs as any)[widget.model].onFieldChange();
                    }}
                  />
                ) : (
                  <a-input
                    vModel={this.current}
                    placeholder={this.$t(widget.options.placeholder)}
                    style={{ width: widget.options.width }}
                    disabled={widget.options.disabled}
                    size={this.globalConfig.size}
                    onBlur={() => {
                      (this.$refs as any)[widget.model].onFieldBlur();
                    }}
                    onChange={() => {
                      (this.$refs as any)[widget.model].onFieldChange();
                    }}
                  />
                ))}

              {/* {widget.type == 'button' && (
            <a-button
              style={{ width: widget.options.width }}
              disabled={widget.options.disabled}
              size={this.globalConfig.size}
              type={widget.options.type}
              icon={widget.options.icon}
            >
              {this.widget.name}
            </a-button>
          )} */}

              {widget.type == 'textarea' && (
                <a-input
                  vModel={this.current}
                  placeholder={this.$t(widget.options.placeholder)}
                  disabled={widget.options.disabled}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  type="textarea"
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();
                  }}
                />
              )}

              {widget.type == 'number' && (
                <a-input-number
                  vModel={this.current}
                  placeholder={this.$t(widget.options.placeholder)}
                  style={{ width: widget.options.width }}
                  disabled={widget.options.disabled}
                  step={widget.options.step}
                  min={widget.options.min}
                  max={widget.options.max}
                  size={this.globalConfig.size}
                  precision={widget.options.precision}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                />
              )}

              {widget.type == 'radio' && (
                <a-radio-group
                  vModel={this.current}
                  style={{ width: widget.options.width }}
                  disabled={widget.options.disabled}
                  size={this.globalConfig.size}
                  onChange={() => {
                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                >
                  {(widget.options.remote
                    ? widget.options.remoteOptions
                    : widget.options.options
                  ).map((item: any, index: number) => {
                    return (
                      <a-radio
                        style={{
                          display: widget.options.inline ? 'inline-block' : 'block',
                        }}
                        value={item.value}
                        key={index}
                      >
                        {widget.options.remote
                          ? widget.options.showLabel
                            ? this.$t(item.label)
                            : item.value
                          : widget.options.showLabel
                            ? this.$t(item.label)
                            : item.value}
                      </a-radio>
                    );
                  })}
                </a-radio-group>
              )}

              {widget.type == 'checkbox' && (
                <a-checkbox-group
                  vModel={this.current}
                  style={{ width: widget.options.width }}
                  disabled={widget.options.disabled}
                  onChange={() => {
                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                >
                  {(widget.options.remote
                    ? widget.options.remoteOptions
                    : widget.options.options
                  ).map((item: any, index: number) => {
                    return (
                      <a-checkbox
                        style={{
                          display: widget.options.inline ? 'inline-block' : 'block',
                        }}
                        value={item.value}
                        key={index}
                      >
                        {widget.options.remote
                          ? widget.options.showLabel
                            ? this.$t(item.label)
                            : item.value
                          : widget.options.showLabel
                            ? this.$t(item.label)
                            : item.value}
                      </a-checkbox>
                    );
                  })}
                </a-checkbox-group>
              )}

              {widget.type == 'time' && !widget.options.isRange && (
                <a-time-picker
                  vModel={this.current}
                  inputReadOnly={widget.options.readonly}
                  allowClear={widget.options.clearable}
                  disabled={widget.options.disabled}
                  hourStep={widget.options.hourStep}
                  minuteStep={widget.options.minuteStep}
                  secondStep={widget.options.secondStep}
                  placeholder={this.$t(widget.options.placeholder)}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-time-picker>
              )}

              {widget.type == 'time' && widget.options.isRange && (
                <TimePickerRange
                  vModel={this.current}
                  placeholder={[
                    this.$t(widget.options.startPlaceholder),
                    this.$t(widget.options.endPlaceholder),
                  ]}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  hourStep={widget.options.hourStep}
                  minuteStep={widget.options.minuteStep}
                  secondStep={widget.options.secondStep}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></TimePickerRange>
              )}

              {widget.type == 'date' && widget.options.type == 'year' && (
                <a-date-picker
                  vModel={this.current}
                  mode="year"
                  placeholder={this.$t(widget.options.placeholder)}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  getCalendarContainer={(triggerNode: any) => triggerNode.parentNode}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onPanelChange={(value: any) => {
                    this.current = value.format(widget.options.format);
                  }}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-date-picker>
              )}

              {widget.type == 'date' && widget.options.type == 'month' && (
                <a-date-picker
                  vModel={this.current}
                  mode="month"
                  getCalendarContainer={(triggerNode: any) => triggerNode.parentNode}
                  placeholder={this.$t(widget.options.placeholder)}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onPanelChange={(value: any) => {
                    this.current = value.format(widget.options.format);
                  }}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-date-picker>
              )}

              {widget.type == 'date' && widget.options.type == 'date' && (
                <a-date-picker
                  vModel={this.current}
                  getCalendarContainer={(triggerNode: any) => triggerNode.parentNode}
                  placeholder={this.$t(widget.options.placeholder)}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-date-picker>
              )}

              {widget.type == 'date' && widget.options.type == 'datetime' && (
                <a-date-picker
                  vModel={this.current}
                  show-time={{
                    format: widget.options.format.split(' ')[1],
                    hourStep: widget.options.hourStep,
                    minuteStep: widget.options.minuteStep,
                    secondStep: widget.options.secondStep,
                  }}
                  getCalendarContainer={(triggerNode: any) => triggerNode.parentNode}
                  placeholder={this.$t(widget.options.placeholder)}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-date-picker>
              )}

              {widget.type == 'date' && widget.options.type == 'datetimerange' && (
                <a-range-picker
                  vModel={this.current}
                  show-time={{
                    format: widget.options.format.split(' ')[1],
                    hourStep: widget.options.hourStep,
                    minuteStep: widget.options.minuteStep,
                    secondStep: widget.options.secondStep,
                  }}
                  placeholder={[
                    this.$t(widget.options.startPlaceholder),
                    this.$t(widget.options.endPlaceholder),
                  ]}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-range-picker>
              )}

              {widget.type == 'date' && widget.options.type == 'daterange' && (
                <a-range-picker
                  vModel={this.current}
                  placeholder={[
                    this.$t(widget.options.startPlaceholder),
                    this.$t(widget.options.endPlaceholder),
                  ]}
                  inputReadOnly={widget.options.readonly}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  style={{ width: widget.options.width }}
                  size={this.globalConfig.size}
                  format={widget.options.format}
                  valueFormat={widget.options.format}
                  onBlur={() => {
                    (this.$refs as any)[widget.model].onFieldBlur();
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-range-picker>
              )}

              {widget.type == 'select' &&
                (widget.options.filterfetch ? (
                  <a-select
                    vModel={this.current}
                    placeholder={this.$t(widget.options.placeholder)}
                    mode={widget.options.multiple ? 'multiple' : 'default'}
                    disabled={widget.options.disabled}
                    showSearch={widget.options.filterfetch}
                    allowClear={widget.options.clearable}
                    optionFilterProp="title"
                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                    style={{ width: widget.options.width }}
                    size={this.globalConfig.size}
                    filter-option={false}
                    onBlur={() => {
                      (this.$refs as any)[widget.model].onFieldBlur();
                    }}
                    onChange={() => {
                      (this.$refs as any)[widget.model].onFieldChange();

                      if (this.remote[widget.options.onchange]) {
                        this.remote[widget.options.onchange](this.current, this.models, this.value);
                      }
                    }}
                    onSearch={this.selectLoad}
                  >
                    {(widget.options.remote
                      ? widget.options.remoteOptions
                      : widget.options.options
                    ).map((item: any) => {
                      return (
                        <a-select-option
                          key={item.value}
                          value={item.value}
                          title={
                            widget.options.remote
                              ? widget.options.showLabel
                                ? this.$t(item.label)
                                : item.value
                              : widget.options.showLabel
                                ? this.$t(item.label)
                                : item.value
                          }
                        >
                          {widget.options.remote
                            ? widget.options.showLabel
                              ? this.$t(item.label)
                              : item.value
                            : widget.options.showLabel
                              ? this.$t(item.label)
                              : item.value}
                        </a-select-option>
                      );
                    })}
                  </a-select>
                ) : (
                  <a-select
                    vModel={this.current}
                    placeholder={this.$t(widget.options.placeholder)}
                    mode={widget.options.multiple ? 'multiple' : 'default'}
                    disabled={widget.options.disabled}
                    showSearch={widget.options.filterable}
                    allowClear={widget.options.clearable}
                    optionFilterProp="title"
                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                    style={{ width: widget.options.width }}
                    size={this.globalConfig.size}
                    onBlur={() => {
                      (this.$refs as any)[widget.model].onFieldBlur();
                    }}
                    onChange={() => {
                      (this.$refs as any)[widget.model].onFieldChange();

                      if (this.remote[widget.options.onchange]) {
                        this.remote[widget.options.onchange](this.current, this.models, this.value);
                      }
                    }}
                  >
                    {(widget.options.remote
                      ? widget.options.remoteOptions
                      : widget.options.options
                    ).map((item: any) => {
                      return (
                        <a-select-option
                          key={item.value}
                          value={item.value}
                          title={
                            widget.options.remote
                              ? widget.options.showLabel
                                ? this.$t(item.label)
                                : item.value
                              : widget.options.showLabel
                                ? this.$t(item.label)
                                : item.value
                          }
                        >
                          {widget.options.remote
                            ? widget.options.showLabel
                              ? this.$t(item.label)
                              : item.value
                            : widget.options.showLabel
                              ? this.$t(item.label)
                              : item.value}
                        </a-select-option>
                      );
                    })}
                  </a-select>
                ))}

              {widget.type == 'ddList' && (
                <this.plugins.DropDownList
                  vModel={this.current}
                  multiple={widget.options.multiple}
                  style={{ width: widget.options.width }}
                  disabled={widget.options.disabled}
                  placeholder={this.$t(widget.options.placeholder)}
                  allowClear={widget.options.clearable}
                  searchType={widget.options.searchType}
                  filterfetch={widget.options.filterfetch}
                  remote={this.remote}
                  fetchFun={widget.options.remoteFunc}
                  searchParams={
                    widget.options.searchParams && widget.options.searchParams.trim() !== ''
                      ? JSON.parse(widget.options.searchParams)
                      : {}
                  }
                  autoSearch={widget.options.autoSearch}
                  count={widget.options.count}
                  size={this.globalConfig.size}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                />
              )}

              {widget.type == 'treeSelect' &&
                (widget.options.asyncLoad ? (
                  widget.options.multiple ? (
                    <a-tree-select
                      v-model={this.treeList}
                      placeholder={this.$t(widget.options.placeholder)}
                      multiple={widget.options.multiple}
                      treeCheckable={widget.options.multiple}
                      tree-data-simple-mode={widget.options.asyncLoad}
                      replaceFields={{
                        children: widget.options.props.children,
                        title: widget.options.props.label,
                        key: widget.options.props.value,
                        value: widget.options.props.value,
                      }}
                      dropdownStyle={{ maxHeight: '300px' }}
                      getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                      showSearch={widget.options.filterable}
                      disabled={widget.options.disabled}
                      allowClear={widget.options.clearable}
                      treeNodeFilterProp="title"
                      style={{ width: widget.options.width }}
                      treeData={widget.options.remoteOptions}
                      treeDefaultExpandedKeys={[
                        widget.options.remoteOptions.length > 0 &&
                        widget.options.remoteOptions[0][widget.options.props.value],
                      ]}
                      labelInValue
                      size={this.globalConfig.size}
                      showCheckedStrategy={widget.options.showCheckedStrategy}
                      onChange={(value: string | string[], label: Array<string>, extra: any) => {
                        this.treeSelected = (value as any).map((o: any) => o.label);
                        // this.treeObj.label = extra.triggerNode.label;
                        this.models[this.widget.model] = (value as any).map((o: any) => o.value);
                        this.current = (value as any).map((o: any) => o.value);
                        this.widget.options.assistField
                          ? (this.models[this.widget.options.assistField] = this.treeSelected)
                          : '';
                        (this.$refs as any)[widget.model].onFieldChange();

                        if (this.remote[widget.options.onchange]) {
                          this.remote[widget.options.onchange](
                            this.current,
                            this.models,
                            this.value,
                          );
                        }
                      }}
                      filterTreeNode={(inputValue: string, treeNode: any) => {
                        return true;
                      }}
                      searchValue={this.treeShowName}
                      on-search={(value: string) => {
                        this.treeShowName = value;
                        this.treeSelectLoad({}, widget.options, value);
                      }}
                      load-data={(treeNode: any) => this.treeSelectLoad(treeNode, widget.options, '')
                      }
                    ></a-tree-select>
                  ) : (
                    <a-tree-select
                      v-model={this.treeObj}
                      placeholder={this.$t(widget.options.placeholder)}
                      multiple={widget.options.multiple}
                      treeCheckable={widget.options.multiple}
                      // tree-data-simple-mode={widget.options.asyncLoad}
                      replaceFields={{
                        children: widget.options.props.children,
                        title: widget.options.props.label,
                        key: widget.options.props.value,
                        value: widget.options.props.value,
                      }}
                      dropdownStyle={{ maxHeight: '300px' }}
                      getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                      showSearch={widget.options.filterable}
                      disabled={widget.options.disabled}
                      allowClear={widget.options.clearable}
                      treeNodeFilterProp="title"
                      style={{ width: widget.options.width }}
                      treeData={widget.options.remoteOptions}
                      treeDefaultExpandedKeys={[
                        widget.options.remoteOptions.length > 0 &&
                        widget.options.remoteOptions[0][widget.options.props.value],
                      ]}
                      labelInValue
                      size={this.globalConfig.size}
                      showCheckedStrategy={widget.options.showCheckedStrategy}
                      onChange={(value: string | string[], label: Array<string>, extra: any) => {
                        this.treeSelected = extra.triggerNode.label;
                        this.treeObj.label = extra.triggerNode.label;
                        this.models[this.widget.model] = this.treeObj.value;
                        this.current = this.treeObj.value;
                        this.widget.options.assistField
                          ? (this.models[this.widget.options.assistField] = this.treeObj.label)
                          : '';
                        (this.$refs as any)[widget.model].onFieldChange();

                        if (this.remote[widget.options.onchange]) {
                          this.remote[widget.options.onchange](
                            this.current,
                            this.models,
                            this.value,
                          );
                        }
                      }}
                      filterTreeNode={(inputValue: string, treeNode: any) => {
                        return true;
                      }}
                      searchValue={this.treeShowName}
                      on-search={(value: string) => {
                        this.treeShowName = value;
                        this.treeSelectLoad({}, widget.options, value);
                      }}
                      load-data={(treeNode: any) => this.treeSelectLoad(treeNode, widget.options, '')

                      }
                    ></a-tree-select>
                  )
                ) : (
                  <a-tree-select
                    v-model={this.current}
                    placeholder={this.$t(widget.options.placeholder)}
                    multiple={widget.options.multiple}
                    treeCheckable={widget.options.multiple}
                    tree-data-simple-mode={widget.options.asyncLoad}
                    replaceFields={{
                      children: widget.options.props.children,
                      title: widget.options.props.label,
                      key: widget.options.props.value,
                      value: widget.options.props.value,
                    }}
                    dropdownStyle={{ maxHeight: '300px' }}
                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                    showSearch={widget.options.filterable}
                    disabled={widget.options.disabled}
                    allowClear={widget.options.clearable}
                    treeNodeFilterProp="title"
                    style={{ width: widget.options.width }}
                    treeData={widget.options.remoteOptions}
                    treeDefaultExpandedKeys={[
                      widget.options.remoteOptions.length > 0 &&
                      widget.options.remoteOptions[0][widget.options.props.value],
                    ]}
                    size={this.globalConfig.size}
                    showCheckedStrategy={widget.options.showCheckedStrategy}
                    onChange={(value: string | string[], label: Array<string>, extra: any) => {
                      this.treeSelected = label;
                      (this.$refs as any)[widget.model].onFieldChange();

                      if (this.remote[widget.options.onchange]) {
                        this.remote[widget.options.onchange](this.current, this.models, this.value);
                      }
                    }}
                    props={widget.options.asyncLoad ? { loadData: this.treeSelectLoad } : null}
                  ></a-tree-select>
                ))}
              {widget.type == 'inputSelect' && loadAntd(widget.options.multiple)}

              {widget.type == 'customSelector' && (
                <a-select
                  ref="selector"
                  vModel={this.current}
                  label-in-value
                  style={{ width: widget.options.width }}
                  open={false}
                  getPopupContainer={() => document.querySelector('.generate-form-item')}
                  mode={widget.options.multiple ? 'multiple' : 'default'}
                  disabled={widget.options.disabled}
                  placeholder={this.$t(widget.options.placeholder)}
                  allowClear={widget.options.clearable}
                  size={this.globalConfig.size}
                  options={this.options}
                  onDropdownVisibleChange={() => {
                    this.$refs.selector.blur();
                    switch (widget.options.type) {
                      case 'user-selector': // 人员选择器
                        this.userVisible = true;
                        break;
                      case 'list-selector': // 列表选择器
                        break;
                    }
                  }}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-select>
              )}

              {widget.type == 'switch' && (
                <a-switch
                  vModel={this.current}
                  disabled={widget.options.disabled}
                  size={this.globalConfig.size}
                  onChange={() => {
                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                />
              )}

              {widget.type == 'text' && <span>{this.current}</span>}
              {widget.type == 'html' && <div domProps-innerHTML={this.current}></div>}
              {widget.type == 'imgupload' && [
                <this.plugins.Upload
                  accept={widget.options.accept}
                  showType="1"
                  maxSize={widget.options.maxSize * 1024 * 1024}
                  multiUploadSize={100 * 1024 * 1024}
                  style={{ width: widget.options.width }}
                  length={widget.options.length}
                  data={{ module: widget.options.module }}
                  fileList={this.current}
                  singleUrl={widget.options.action}
                  del={widget.options.isDelete}
                  disabled={widget.options.disabled}
                  multiple={widget.options.multiple}
                  alise={this.$t(widget.options.alise)}
                  onSuccess={(data: any[]) => {
                    this.current = data.map(file => ({
                      key: widget.model,
                      keyName: widget.name,
                      uid: file.id || file.uid,
                      url: file.url,
                      name: file.name,
                      status: file.status,
                      path: file.path,
                      storageId: file.id || file.storageId,
                      storageName: file.name,
                      storageType: file.contentType || file.storageType,
                      storageUrl: file.url,
                    }));

                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                  onRemove={(data: any) => {
                    this.current = this.current.filter((item: any) => item.path != data.path);

                    (this.$refs as any)[widget.model].onFieldChange();

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                  onError={(error: any) => {
                    console.log(error);
                  }}
                />,
                widget.options.fileExample?.length > 0 && (
                  <div
                    style="width: 106px; text-align: center; position: relative; top: -10px;"
                    onClick={() => {
                      this.previewVisible = true;
                    }}
                  >
                    <a-button type="link">预览</a-button>
                  </div>
                ),
                widget.options.fileExample?.length > 0 && (
                  <a-modal
                    visible={this.previewVisible}
                    footer={null}
                    title="预览"
                    wrapClassName="component-pop-upload-preview"
                    onCancel={() => {
                      this.previewVisible = false;
                    }}
                  >
                    <a-carousel
                      arrows
                      scopedSlots={{
                        prevArrow: (props: any) => {
                          return (
                            <div class="custom-slick-arrow" style="left: 10px; z-index: 1;">
                              <a-icon type="left-circle" />
                            </div>
                          );
                        },
                        nextArrow: (props: any) => {
                          return (
                            <div class="custom-slick-arrow" style="right: 10px">
                              <a-icon type="right-circle" />
                            </div>
                          );
                        },
                      }}
                    >
                      {widget.options.fileExample.map((ele: any) => {
                        return (
                          <div style="height: 200px;">
                            <img
                              src={ele.url}
                              style="object-fit: scale-down; width: 100%; height: 100%;"
                            />
                          </div>
                        );
                      })}
                    </a-carousel>
                  </a-modal>
                ),
              ]}
              {widget.type == 'cascader' && (
                <a-cascader
                  vModel={this.current}
                  disabled={widget.options.disabled}
                  allowClear={widget.options.clearable}
                  getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                  placeholder={this.$t(widget.options.placeholder)}
                  fieldNames={widget.options.props}
                  style={{ width: widget.options.width }}
                  options={widget.options.remoteOptions}
                  size={this.globalConfig.size}
                  onChange={(value: Array<string>, selectedOptions: Array<any>) => {
                    this.cascaderSelected = selectedOptions
                      .map((item: any) => {
                        return item[widget.options.props['label']];
                      })
                      .join('/');

                    if (this.remote[widget.options.onchange]) {
                      this.remote[widget.options.onchange](this.current, this.models, this.value);
                    }
                  }}
                ></a-cascader>
              )}
            </div>
          )}
        </a-form-model-item>
      );
    };
    if (widget.options.isControl) {
      console.log('json', JSON.parse(JSON.stringify(widget.options.controlCondition)))
    }

    // console.log('item', this.remote, JSON.parse(JSON.stringify(widget.options)));
    return (
      <div class="generate-form-item">
        {this.filterKeys.length > 0 && this.filterKeysState ? temp() : null}

        {this.filterKeys.length == 0 &&
          (!widget.options.isControl ||
            (widget.options.isControl &&
              this.executeStr(widget.options.controlCondition, this.models, this.value)))
          ? temp()
          : null}

        {widget.options.type == 'user-selector' && (
          <this.plugins.UserSelector
            visible={this.userVisible}
            defaultValue={this.current}
            on={{
              ['update:visible']: (value: boolean) => {
                this.userVisible = value;
              },
              close: (data: any) => {
                if (widget.options.multiple) {
                  this.options = data.map((item: any) => ({
                    key: item.id,
                    label: item.name,
                  }));
                  this.current = JSON.parse(JSON.stringify(this.options));
                } else {
                  this.options = data
                    .slice(-1)
                    .map((item: any) => ({ key: item.id, label: item.name }));

                  this.current = this.options[0];
                }

                (this.$refs as any)[widget.model].onFieldChange();

                if (this.remote[widget.options.onchange]) {
                  this.remote[widget.options.onchange](this.current, this.models, this.value);
                }

                // 下面的数据处理方式与上面的方式不一样
                /* if (data.length <= 0) return;

                if (widget.options.multiple) {
                  this.options = this.options.concat(
                    data.map((item: any) => ({ key: item.id, label: item.name }))
                  );
                  this.options = uniqby(this.options, 'key');

                  this.current = JSON.parse(JSON.stringify(this.options));
                } else {
                  this.options = data
                    .slice(-1)
                    .map((item: any) => ({ key: item.id, label: item.name }));

                  this.current = this.options[0];
                } */
              },
            }}
          />
        )}
      </div>
    );
  }
}
