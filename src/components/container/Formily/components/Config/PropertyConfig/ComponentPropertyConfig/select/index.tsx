import { Component, Prop, Vue } from 'vue-property-decorator';
import DataTypeSwitch from '../../../../DataTypeSwitch';

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

  render() {
    return (
      <a-form-model
        props={{ model: this.componentProperties }}
        label-col={{ span: 9 }}
        wrapper-col={{ span: 14, offset: 1 }}
        labelAlign="left"
      >
        <a-form-model-item label="模式">
          <a-radio-group vModel={this.componentProperties.mode} button-style="solid">
            <a-radio-button value="default">单选</a-radio-button>
            <a-radio-button value="multiple">多选</a-radio-button>
          </a-radio-group>
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
                  title="是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false"
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

        <a-form-model-item label="最多标签数量">
          <a-input-number
            vModel={this.componentProperties.maxTagCount}
            style="width: 100%"
            placeholder="请输入"
          />
        </a-form-model-item>

        <a-form-model-item label="最多标签占位">
          <a-input vModel={this.componentProperties.maxTagPlaceholder} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="最多标签文本长度">
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
                  title="自定义字段名：此处为数据格式映射，为了统一各个UI库之间的数据格式以及支撑后端数据源格式，当数据源为静态数据时，子级值需置为children"
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
            scopedSlots={{
              content: () => {
                return (
                  <div style="width: 200px">
                    <a-input
                      addon-before="标签值"
                      placeholder="请输入"
                      vModel={this.componentProperties.replaceField.label}
                    />
                    <a-input
                      addon-before="数据值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.componentProperties.replaceField.value}
                    />
                    <a-input
                      addon-before="语言值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.componentProperties.replaceField.lang}
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
