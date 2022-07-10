import { Component, Prop, Vue, Emit, Inject } from 'vue-property-decorator';
import { createHash } from '../../utils/format';
import CustomEditor from '../CustomEditor';

@Component
export default class ControlCenter extends Vue {
  /**
   * 当前选中的组件的受控中心的配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  /**
   * 当前组件唯一编号
   */
  @Prop({
    type: String,
    default: '',
  })
  id!: string;

  /**
   * 当前所要移除的状态列表，值为变量states中的value属性
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  removeStateList!: string[];

  @Inject('generateComponentTree')
  generateComponentTree!: (filterNode?: string[]) => any[];

  // 生成的组件树
  private treeData: any[] = [];

  // 表格配置数据
  private columns = [
    {
      title: '来源字段',
      dataIndex: 'source',
      key: 'source',
      scopedSlots: { customRender: 'source' },
      width: 240,
    },
    {
      title: '字段属性',
      dataIndex: 'property',
      key: 'property',
      scopedSlots: { customRender: 'property' },
      width: 240,
    },
    {
      title: '变量名',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '变量类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      scopedSlots: { customRender: 'action' },
    },
  ];

  // 初始化时转换的data
  private copyData: any = null;

  // 状态列表，后续可扩展
  private states = [
    {
      label: '展示状态',
      value: 'display',
      demo:
        "/** \r\n * Example 1\r\n * Equal Condition Associated\r\n */\r\n\r\n$deps.VariableName === 'TARGET_VALUE' ? 'visible' : 'none'",
      remark: '`visible` | `hidden` | `none`',
    },
    {
      label: 'UI形态',
      value: 'pattern',
      demo:
        "/** \r\n * Example 1\r\n * Equal Condition Associated\r\n */\r\n\r\n$deps.VariableName === 'TARGET_VALUE' ? 'editable' : 'disabled'",
      remark: '`editable` | `disabled` | `readOnly` | `readPretty`',
    },
    {
      label: '标题',
      value: 'title',
      demo:
        "/** \r\n * Example 1\r\n * Associated String\r\n */\r\n\r\n$deps.VariableName === 'TARGET_VALUE' ? 'Associated String Text' : ''",
      remark: '`string`',
    },
    {
      label: '是否必填',
      value: 'required',
      demo:
        "/** \r\n * Example 1\r\n * Static Boolean\r\n */\r\n \r\nfalse\r\n\r\n/** \r\n * Example 2\r\n * Equal Calculation\r\n */\r\n\r\n$deps.VariableName === 'TARGET_VALUE'",
      remark: '`boolean`',
    },
    {
      label: '字段值',
      value: 'value',
      demo:
        "/** \r\n * Example 1\r\n * String Type\r\n */\r\n\r\n'String'\r\n\r\n/** \r\n * Example 2\r\n * String Array\r\n */\r\n\r\n['StringArray']\r\n\r\n/** \r\n * Example 3\r\n * Object Array\r\n */\r\n\r\n[{ key: 'ObjectArray' }]\r\n\r\n/** \r\n * Example 4\r\n * Boolean\r\n */\r\n\r\ntrue",
      remark: '`any`',
    },
    {
      label: '默认值',
      value: 'defaultValue',
      demo:
        "/** \r\n * Example 1\r\n * String Type\r\n */\r\n\r\n'String'\r\n\r\n/** \r\n * Example 2\r\n * String Array\r\n */\r\n\r\n['StringArray']\r\n\r\n/** \r\n * Example 3\r\n * Object Array\r\n */\r\n\r\n[{ key: 'ObjectArray' }]\r\n\r\n/** \r\n * Example 4\r\n * Boolean\r\n */\r\n\r\ntrue",
      remark: '`any`',
    },
  ];

  // 过滤掉不需要的状态列表
  get filterStates() {
    return this.states.filter(item => !this.removeStateList.includes(item.value));
  }

  // 当前选中的状态，默认取第一个
  private currentActiveState = this.filterStates[0];

  created() {
    this.copyData = JSON.parse(JSON.stringify(this.data));
    this.treeData = this.generateComponentTree([this.id]);
  }

  /**
   * 确认回调
   * @param value 回调数据
   */
  @Emit('confirm')
  protected handleConfirm(value: any) {}

  /**
   * 退出回调
   */
  @Emit('cancel')
  protected handleCancel() {}

  render() {
    return (
      <a-modal
        visible
        title="受控中心"
        keyboard={false}
        maskClosable={false}
        width={1200}
        getContainer={() => {
          return document.querySelector('.property-config-wrapper');
        }}
        onOk={() => {
          this.handleConfirm(this.copyData);
        }}
        onCancel={() => {
          this.handleCancel();
        }}
      >
        <div style="min-height: 500px">
          <a-alert
            message="以下属性变化依托于指定字段的属性变化而改变"
            type="info"
            show-icon
            style="margin-bottom: 10px;"
          />
          <a-collapse
            default-active-key="1"
            scopedSlots={{
              expandIcon: (props: any) => {
                return <a-icon type="caret-right" rotate={props.isActive ? 90 : 0} />;
              },
            }}
          >
            <a-collapse-panel key="1" header="依赖字段">
              <a-table
                columns={this.columns}
                rowKey={() => {
                  return createHash();
                }}
                size="middle"
                pagination={false}
                bordered
                dataSource={this.copyData.dependencies}
                scopedSlots={{
                  action: (text: any, data: any, index: number) => {
                    return (
                      <a-button
                        type="danger"
                        icon="delete"
                        onClick={() => {
                          this.copyData.dependencies.splice(index, 1);
                        }}
                      />
                    );
                  },
                  source: (text: any, data: any) => {
                    return (
                      <a-tree-select
                        vModel={data.source}
                        style="width: 100%"
                        dropdown-style={{
                          maxHeight: '400px',
                          overflow: 'auto',
                        }}
                        treeData={this.treeData}
                        placeholder="请选择"
                        onChange={(value: any, label: any, extra: any) => {
                          if (!data.name) {
                            data.name = `v_${createHash(12)}`;
                          }
                        }}
                      ></a-tree-select>
                    );
                  },
                  property: (text: any, data: any) => {
                    return (
                      <a-select vModel={data.property} showSearch style="width: 100%">
                        <a-select-option value="value">value(字段值)</a-select-option>
                        <a-select-option value="pattern">pattern(UI形态)</a-select-option>
                        <a-select-option value="display">display(展示状态)</a-select-option>
                        <a-select-option value="defaultValue">defaultValue(默认值)</a-select-option>
                        <a-select-option value="title">title(标题)</a-select-option>
                      </a-select>
                    );
                  },
                  name: (text: any, data: any) => {
                    return <a-input vModel={data.name} addonBefore="$deps." />;
                  },
                }}
              ></a-table>
              <a-button
                type="dashed"
                block
                icon="plus"
                style="margin-top: 10px"
                onClick={() => {
                  this.copyData.dependencies.push({
                    source: '',
                    property: 'value',
                    name: '',
                    type: 'string',
                  });
                }}
              >
                添加依赖字段
              </a-button>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="属性响应(仅支持JS表达式)">
              <a-row type="flex" gutter={10}>
                <a-col span={4} style="height: 242px; overflow: auto">
                  <a-menu
                    style="width: 100%; border-right: none"
                    mode="inline"
                    theme="light"
                    defaultSelectedKeys={['display']}
                    onClick={(data: any) => {
                      this.currentActiveState =
                        this.filterStates.find(item => item.value === data.key) ??
                        this.filterStates[0];
                    }}
                  >
                    {this.filterStates.map(item => {
                      return <a-menu-item key={item.value}>{item.label}</a-menu-item>;
                    })}
                  </a-menu>
                </a-col>
                <a-col span={10}>
                  <div>
                    $self.{this.currentActiveState.value} = {'( // 表达式值类型为'}
                    {this.currentActiveState.remark}
                  </div>
                  <CustomEditor
                    height="200"
                    onChange={(value: string) => {
                      this.copyData.fulfill.state[this.currentActiveState.value] = value;
                    }}
                    value={this.copyData.fulfill.state[this.currentActiveState.value]}
                    lang="javascript"
                  ></CustomEditor>
                  <div>{')'}</div>
                </a-col>
                <a-col span={10}>
                  <div>Example:</div>
                  <CustomEditor
                    height="200"
                    readOnly
                    value={this.currentActiveState.demo}
                    lang="javascript"
                  ></CustomEditor>
                </a-col>
              </a-row>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-modal>
    );
  }
}
