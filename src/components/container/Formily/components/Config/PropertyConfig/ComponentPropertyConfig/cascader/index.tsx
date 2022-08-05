import { Component, Prop, Vue } from 'vue-property-decorator';
import DataTypeSwitch from '../../../../DataTypeSwitch';

@Component
export default class Cascader extends Vue {
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
                <a-tooltip placement="left" title="选择时触发：点选每级菜单选项值都会发生变化">
                  选择时触发
                </a-tooltip>
              );
            },
          }}
        >
          <a-switch vModel={this.componentProperties.changeOnSelect} />
        </a-form-model-item>

        <a-form-model-item
          label="自动获取焦点"
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
        >
          <a-switch vModel={this.componentProperties.autoFocus} />
        </a-form-model-item>

        <a-form-model-item
          label-col={{ span: 14 }}
          wrapper-col={{ span: 9, offset: 1 }}
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="支持搜索：暂不支持服务端搜索，且无法与动态加载一起使用"
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
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="渲染函数：格式为：({labels, selectedOptions}) => vNode"
                >
                  渲染函数
                </a-tooltip>
              );
            },
          }}
        >
          <DataTypeSwitch
            dataType="expression"
            values={this.componentProperties.displayRender}
            types={['expression']}
            on={{
              ['update:dataType']: (newType: string) => {
                this.componentProperties.displayRender = newType;
              },
              change: (value: string) => {
                this.componentProperties.displayRender = value;
              },
            }}
          />
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip placement="left" title="展开方式：次级菜单的展开方式">
                  展开方式
                </a-tooltip>
              );
            },
          }}
        >
          <a-select vModel={this.componentProperties.expandTrigger} placeholder="请选择">
            <a-select-option value="click">单击</a-select-option>
            <a-select-option value="hover">移入</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          scopedSlots={{
            label: () => {
              return (
                <a-tooltip
                  placement="left"
                  title="自定义字段名：此处为数据格式映射，为了统一各个UI库之间的数据格式以及支撑后端数据源格式"
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
                      addon-before="子级值"
                      placeholder="请输入"
                      style="margin-top: 10px"
                      vModel={this.componentProperties.replaceField.children}
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

        <a-form-model-item label="空状态内容">
          <a-input vModel={this.componentProperties.notFoundContent} placeholder="请输入" />
        </a-form-model-item>

        <a-form-model-item label="空状态国际化标识">
          <a-input vModel={this.componentProperties.notFoundContentLangKey} placeholder="请输入" />
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
      </a-form-model>
    );
  }
}
