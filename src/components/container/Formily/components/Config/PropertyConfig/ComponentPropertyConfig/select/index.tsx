import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DataTypeSwitch from '../../../../DataTypeSwitch';
import CustomEditor from '../../../../CustomEditor';
import { isUndefined } from 'lodash';

@Component
export default class Select extends Vue {
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

  // 是否显示远端搜索参数配置气泡框
  private remoteSearchArgVisible = false;

  // 是否显示远端查询回调配置气泡框
  private remoteSearchCallbackVisible = false;

  $refs!: {
    remoteSearchArgs: CustomEditor;
    remoteSearchCallback: CustomEditor;
  };

  @Watch('select', { deep: true })
  private selectChangeHanlde() {
    this.upgradeConfig();
  }

  created() {
    this.upgradeConfig();
  }

  /**
   * 组件配置升级策略
   * -----此处会按照版本发布来进行升级----
   */
  private upgradeConfig() {
    if (isUndefined(this.componentProperties.remoteSearch)) {
      this.$set(this.select.componentProperties, 'remoteSearch', {
        args: '',
        callback: '(res) => {\n  return res.data;\n}',
      });
    }

    if (isUndefined(this.componentProperties.replaceField.children)) {
      this.$set(this.select.componentProperties.replaceField, 'children', 'children');
    }
  }

  // 临时存储替换字段值
  private replaceField = {
    label: '',
    value: '',
    children: '',
    lang: '',
  };

  render() {
    return (
      <a-form-model
        props={{ model: this.componentProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="模式：如需默认值，在单选时，请选择文本或者数值进行设置，在多选时，请选择表达式进行设置"
                >
                  模式
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.mode}>
            <a-select-option value="default">单选</a-select-option>
            <a-select-option value="multiple">多选</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          label="允许清除内容"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.allowClear} />
        </a-form-model-item>

        <a-form-model-item
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="是否在选中项后清空搜索框，仅在多选模式下支持">
                  选中自动清除
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.autoClearSearchValue} />
        </a-form-model-item>

        <a-form-model-item
          label="下拉菜单和选择器同宽"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.dropdownMatchSelectWidth} />
        </a-form-model-item>

        <a-form-model-item
          label="自动获取焦点"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.autoFocus} />
        </a-form-model-item>

        <a-form-model-item
          label="默认高亮第一个选项"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.defaultActiveFirstOption} />
        </a-form-model-item>

        <a-form-model-item
          label="默认展开"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.defaultOpen} />
        </a-form-model-item>

        <a-form-model-item
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 { key: string, label: vNodes } 的格式"
                >
                  标签值
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.labelInValue} />
        </a-form-model-item>

        <a-form-model-item
          label="显示箭头"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.showArrow} />
        </a-form-model-item>

        <a-form-model-item
          label="单选支持搜索"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.showSearch} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="选项过滤属性：搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索"
                >
                  选项过滤属性
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.optionFilterProp} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="回填属性：回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value"
                >
                  回填属性
                </a-tooltip>
              );
            },
          }}
        >
          <a-input
            vModel={this.componentProperties.optionLabelProp}
            defaultValue="children"
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="选项筛选器：是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false，格式：(inputValue, option) => boolean;"
                >
                  选项筛选器
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType={this.componentProperties.filterOption.dataType}
            values={this.componentProperties.filterOption.value}
            types={['expression', 'boolean']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.filterOption.dataType = newType;
              },
              change: (value: boolean | string) => {
                this.componentProperties.filterOption.value = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="弹框滚动高度，单位 px">
                  弹框滚动高度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            vModel={this.componentProperties.listHeight}
            style="width: 100%"
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="最多标签数量：最多显示多少个 tag">
                  最多标签数量
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            vModel={this.componentProperties.maxTagCount}
            style="width: 100%"
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="最多标签占位：隐藏 tag 时显示的内容">
                  最多标签占位
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.maxTagPlaceholder} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="最多标签占位国际化标识：隐藏 tag 时显示的多语言内容"
                >
                  最多标签占位国际化标识
                </a-tooltip>
              );
            },
          }}
        >
          <a-input
            defaultValue=""
            vModel={this.componentProperties.maxTagPlaceholderLangKey}
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="最多标签文本长度：最大显示的 tag 文本长度">
                  最多标签文本长度
                </a-tooltip>
              );
            },
          }}
        >
          <a-input-number
            vModel={this.componentProperties.maxTagTextLength}
            style="width: 100%"
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item label="空状态内容">
          <a-input vModel={this.componentProperties.notFoundContent} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="空状态国际化标识">
          <a-input vModel={this.componentProperties.notFoundContentLangKey} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="自定义字段名：此处为数据格式映射，为了统一各个UI库之间的数据格式以及支撑后端数据源格式，此处会将数据源在内部进行转换，当数据源为静态数据时，子级值需置为children"
                >
                  自定义字段名
                </a-tooltip>
              );
            },
          }}
        >
          <a-popover
            trigger="click"
            placement="bottomRight"
            arrow-point-at-center
            onVisibleChange={(visible: boolean) => {
              if (visible) {
                this.replaceField = JSON.parse(
                  JSON.stringify(this.componentProperties.replaceField),
                );
              } else {
                this.componentProperties.replaceField = {
                  ...this.componentProperties.replaceField,
                  ...this.replaceField,
                };
              }
            }}
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 200px">
                    <a-input
                      addon-before="标签值"
                      placeholder="请输入"
                      vModel={this.replaceField.label}
                    />
                    <a-input
                      addon-before="数据值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.replaceField.value}
                    />
                    <a-input
                      addon-before="子级值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.replaceField.children}
                    />
                    <a-input
                      addon-before="语言值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.replaceField.lang}
                    />
                  </div>
                );
              },
            }}
          >
            <a-button block>设置</a-button>
          </a-popover>
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
            <a-select-option value="large">大</a-select-option>
            <a-select-option value="default">默认</a-select-option>
            <a-select-option value="small">小</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="占位提示">
          <a-input vModel={this.componentProperties.placeholder} placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="占位提示国际化标识">
          <a-input vModel={this.componentProperties.placeholderLangKey} placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="远端搜索回调：搜索框值变化后所执行的查询动作，一般处理远端查询时使用，注意：此时组件属性配置中选项筛选器需置为false，且字段属性中的选项来源需选择动态数据，若为单选请开启搜索功能，内部已内置节流控制，请求时序控制。选择的数据来自表单配置中的API接口中心数据，如若已选择的数据在动作响应中心被删除，此处不会自动更新选中值，请主动删除"
                >
                  远端搜索回调
                </a-tooltip>
              );
            },
          }}
        >
          <a-select
            vModel={this.componentProperties.remoteSearch.key}
            placeholder="请选择"
            allowClear
          >
            {this.data.config.apis.map((item: any) => {
              return <a-select-option value={item.key}>{item.name}</a-select-option>;
            })}
          </a-select>
        </a-form-model-item>

        {this.componentProperties.remoteSearch.key && [
          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip
                    placement="left"
                    title="远端搜索参数：数据源所需参数信息，格式：(value) => Object，其中value为搜索文本值"
                  >
                    远端搜索参数
                  </a-tooltip>
                );
              },
            }}
          >
            <a-popover
              trigger="click"
              placement="bottomRight"
              arrow-point-at-center
              visible={this.remoteSearchArgVisible}
              onVisibleChange={(visible: boolean) => {
                this.remoteSearchArgVisible = visible;
                if (!visible) {
                  this.componentProperties.remoteSearch.args = this.$refs.remoteSearchArgs.getValue();
                }
              }}
              scopedSlots={{
                content: () => {
                  return (
                    <div style="width: 300px">
                      <CustomEditor
                        height="200"
                        theme="chrome"
                        ref="remoteSearchArgs"
                        value={this.componentProperties.remoteSearch.args}
                        lang="javascript"
                      ></CustomEditor>
                    </div>
                  );
                },
              }}
            >
              <a-button block>参数设置</a-button>
            </a-popover>
          </a-form-model-item>,

          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip
                    placement="left"
                    title="远端搜索回调函数：在返回业务数据后的回调处理，此回调返回的数据将作为此控件最终数据源，参数res为api返回的业务数据，格式：(res) => Object"
                  >
                    远端搜索回调函数
                  </a-tooltip>
                );
              },
            }}
          >
            <a-popover
              trigger="click"
              placement="bottomRight"
              arrow-point-at-center
              visible={this.remoteSearchCallbackVisible}
              onVisibleChange={(visible: boolean) => {
                this.remoteSearchCallbackVisible = visible;
                if (!visible) {
                  this.componentProperties.remoteSearch.callback = this.$refs.remoteSearchCallback.getValue();
                }
              }}
              scopedSlots={{
                content: () => {
                  return (
                    <div style="width: 300px">
                      <CustomEditor
                        height="200"
                        theme="chrome"
                        ref="remoteSearchCallback"
                        value={this.componentProperties.remoteSearch.callback}
                        lang="javascript"
                      ></CustomEditor>
                    </div>
                  );
                },
              }}
            >
              <a-button block>回调设置</a-button>
            </a-popover>
          </a-form-model-item>,
        ]}

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
