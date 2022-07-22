import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import CustomEditor from '../CustomEditor';

@Component
export default class DataTypeSwitch extends Vue {
  /**
   * 当前value值
   */
  @Prop({})
  values!: any;

  /**
   * 当前数据类型
   */
  @Prop({
    type: String,
    default: 'text',
  })
  dataType!: string;

  /**
   * 支持数据类型列表
   */
  @Prop({
    type: Array,
    default: () => ['text', 'expression', 'boolean', 'number'],
  })
  types!: string[];

  // 列表全量数据
  private typeList = [
    { label: '文本', value: 'text' },
    { label: '表达式', value: 'expression' },
    { label: '布尔', value: 'boolean' },
    { label: '数值', value: 'number' },
  ];

  get filterTypeList() {
    return this.typeList.filter(item => this.types.includes(item.value));
  }

  get booleanTans() {
    if (this.dataType === 'boolean') {
      return this.values ? 'true' : 'false';
    }

    return null;
  }

  private visible = false;

  $refs!: {
    expression: CustomEditor;
  };

  @Emit('change')
  protected updateValue(val: any) {}

  @Emit('update:dataType')
  protected updateDataType(newVal: string) {}

  private temps: any = {
    text: '',
    expression: '',
    boolean: true,
    number: null,
  };

  render() {
    return (
      <div>
        <a-row justify="space-between" type="flex" align="middle">
          <a-col span={this.types.length === 1 ? 24 : 18}>
            {this.dataType === 'text' && (
              <a-input
                value={this.values}
                placeholder="请输入"
                onChange={(e: any) => {
                  this.updateValue(e.target.value);
                }}
              />
            )}
            {this.dataType === 'expression' && (
              <a-popover
                trigger="click"
                placement="bottomRight"
                arrow-point-at-center
                visible={this.visible}
                onVisibleChange={(visible: boolean) => {
                  this.visible = visible;
                  if (!visible) {
                    this.updateValue(this.$refs.expression.getValue());
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
                          value={this.values}
                          lang="javascript"
                        ></CustomEditor>
                      </div>
                    );
                  },
                }}
              >
                <a-button block style="position: relative; top: -1px;">
                  表达式
                </a-button>
              </a-popover>
            )}
            {this.dataType === 'boolean' && (
              <a-select
                value={this.booleanTans}
                onChange={(value: string) => {
                  this.updateValue(value === 'false' ? false : true);
                }}
                options={[
                  { value: 'false', label: 'False' },
                  { value: 'true', label: 'True' },
                ]}
              ></a-select>
            )}
            {this.dataType === 'number' && (
              <a-input-number
                style="width: 100%"
                value={this.values}
                placeholder="请输入"
                onChange={(value: number) => {
                  this.updateValue(value);
                }}
              />
            )}
          </a-col>
          {this.types.length != 1 && (
            <a-col span={5} offset={1}>
              <a-popover
                placement="bottomRight"
                arrow-point-at-center
                scopedSlots={{
                  content: () => {
                    return (
                      <div>
                        <a-radio-group
                          value={this.dataType}
                          onChange={(e: any) => {
                            this.temps[this.dataType] = this.values;

                            const type = e.target.value;
                            this.updateDataType(type);
                            this.updateValue(this.temps[type]);
                          }}
                          button-style="solid"
                        >
                          {this.filterTypeList.map(item => {
                            return <a-radio-button value={item.value}>{item.label}</a-radio-button>;
                          })}
                        </a-radio-group>
                      </div>
                    );
                  },
                }}
              >
                <a-button style="width: 100%" icon="edit"></a-button>
              </a-popover>
            </a-col>
          )}
        </a-row>
      </div>
    );
  }
}
