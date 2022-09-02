import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DataTypeSwitch from '../../../../DataTypeSwitch';
import { isUndefined } from 'lodash';

@Component
export default class TreeSelect extends Vue {
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

  // 临时存储替换字段值
  private replaceField = {
    title: '',
    value: '',
    children: '',
    lang: '',
  };

  // 缓存组件属性配置
  get componentProperties() {
    return this.select.componentProperties;
  }

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
    if (isUndefined(this.componentProperties.multiple)) {
      this.$set(this.select.componentProperties, 'multiple', false);
    }
  }

  render() {
    return (
      <a-form-model
        props={{ model: this.componentProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item
          label="允许清除内容"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.allowClear} />
        </a-form-model-item>

        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="标签值：是否把每个选项的 label 包装到 value 中，会把 value 类型从 string 变为 {value: string | number, label: VNode } 的格式，如果在复选且完全受控情况下，将强制为开启状态，但不会自动变成开启状态，而是此属性在应用层内置为开启"
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
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="支持搜索：在下拉中显示搜索框(仅在单选模式下生效)"
                >
                  支持搜索
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.showSearch} />
        </a-form-model-item>

        <a-form-model-item
          label="开启多选"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.multiple} />
        </a-form-model-item>

        <a-form-model-item
          label="开启复选"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.treeCheckable} />
        </a-form-model-item>

        <a-form-model-item
          label="默认展开所有"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.treeDefaultExpandAll} />
        </a-form-model-item>

        <a-form-model-item
          label="下拉菜单和选择器同宽"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.dropdownMatchSelectWidth} />
        </a-form-model-item>

        <a-form-model-item
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="完全受控：复选状态下节点选择完全受控（父子节点选中状态不再关联），会使得 标签值(labelInValue) 强制为 开启状态，非复选状态下无效"
                >
                  完全受控
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.treeCheckStrictly} />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="复选回显策略：开启复选时，定义回显到控件的策略，如果组件完全受控，将不起作用"
                >
                  复选回显策略
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.showCheckedStrategy} placeholder="请选择">
            <a-select-option value="SHOW_ALL">显示所有</a-select-option>
            <a-select-option value="SHOW_PARENT">显示父节点</a-select-option>
            <a-select-option value="SHOW_CHILD">显示子节点</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="默认展开选项：格式：Array<string | number>，配置时，类型为string，在应用层会将string转成Array<string | number>"
                >
                  默认展开选项
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType="expression"
            values={this.componentProperties.treeDefaultExpandedKeys}
            types={['expression']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.treeDefaultExpandedKeys = newType;
              },
              change: (value: string) => {
                this.componentProperties.treeDefaultExpandedKeys = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="节点过滤属性：输入项过滤对应的 treeNode 属性，默认值为value，如果想使用标签，可设置title/label，如果为label，替换字段中的标签值必须为label，否则请使用title"
                >
                  节点过滤属性
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.treeNodeFilterProp} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="标签显示名称：默认值为title，此处的值一般为label或者title，注意：此处的值不是替换字段中的键名也不是数据源中的显示值（如：数据源中的name）的键名，如果不理解此解释，填写title就行"
                >
                  标签显示名称
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.treeNodeLabelProp} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="节点过滤器：是否根据输入项进行筛选，默认用 节点过滤属性 的值作为要筛选的 TreeNode 的属性值，若为表达式，格式为：(inputValue: string, treeNode: TreeNode) => boolean，如果为否，搜索文本为任何数据，都将全部展开节点，搜索将无效"
                >
                  节点过滤器
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType={this.componentProperties.filterTreeNode.dataType}
            values={this.componentProperties.filterTreeNode.value}
            types={['boolean', 'expression']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.filterTreeNode.dataType = newType;
              },
              change: (value: string) => {
                this.componentProperties.filterTreeNode.value = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="使用简单数据结构：使用简单格式的 treeData，通俗讲是下拉树数据源为一级数据结构的列表数据，但必须数据项之间一定要有父子关系，如pId，最终由组件递归转成树形结构数据，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: [{id:1, pId:0, value:'1', label:'test1',...},...], pId 是父节点的 id)，如果是表达式的配置方式，格式为：{ id: 'id', pId: 'pId' }，其实就是类似替换字段的功能，如果为布尔且为True，默认为{ id: 'id', pId: 'pId' }，此时可能需要修改自定义字段名的配置"
                >
                  使用简单数据结构
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType={this.componentProperties.treeDataSimpleMode.dataType}
            values={this.componentProperties.treeDataSimpleMode.value}
            types={['boolean', 'expression']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.treeDataSimpleMode.dataType = newType;
              },
              change: (value: string) => {
                this.componentProperties.treeDataSimpleMode.value = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item label="弹框滚动高度">
          <a-input-number
            vModel={this.componentProperties.listHeight}
            placeholder="请输入"
            style="width: 100%"
            min={10}
          />
        </a-form-model-item>

        <a-form-model-item label="最多标签个数">
          <a-input-number
            vModel={this.componentProperties.maxTagCount}
            placeholder="请输入"
            style="width: 100%"
            min={1}
            onChange={(value: string | number) => {
              if (value === '') {
                this.componentProperties.maxTagCount = null;
              }
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="自定义字段名：此处为数据格式映射，为了统一各个UI库之间的数据格式以及支撑后端数据源格式，请注意字段名必须与数据源对应上，否者会报错，当数据源为静态数据时，子级值需置为children"
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
                      vModel={this.replaceField.title}
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
                <a-tooltip
                  placement="left"
                  title="尺寸：配置控件大小，默认继承表单配置中的尺寸设置"
                >
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
                <a-tooltip placement="left" title="搜索占位提示：此占位符仅在单选模式下生效">
                  搜索占位提示
                </a-tooltip>
              );
            },
          }}
        >
          <a-input vModel={this.componentProperties.searchPlaceholder} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item
          label="搜索占位提示国际化标识"
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="搜索占位提示国际化标识：此占位符仅在单选模式下生效"
                >
                  搜索占位提示国际化标识
                </a-tooltip>
              );
            },
          }}
        >
          <a-input
            vModel={this.componentProperties.searchPlaceholderLangKey}
            placeholder="请输入"
          />
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
