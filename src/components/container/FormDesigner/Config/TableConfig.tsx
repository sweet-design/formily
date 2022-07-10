import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import './TableConfig.less';

@Component
export default class TableConfig extends Vue {
  /**
   * 是否显示table的列配置窗口
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 列配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: Record<string, any>;

  @Emit('close')
  protected handleClose(state: boolean) {}

  private configs: any = this.config; // 复制当前配置信息

  @Emit('update:config')
  protected updateSelect(newVal: any) {}

  @Watch('configs', { deep: true })
  private watchConfigs(value: any) {
    this.updateSelect(value);
  }

  handleSelectMuliple(value: boolean) {
    if (value) {
      if (this.configs.defaultValue) {
        this.configs.defaultValue = [this.configs.defaultValue];
      } else {
        this.configs.defaultValue = [];
      }
    } else {
      if (this.configs.defaultValue.length > 0) {
        this.configs.defaultValue = this.configs.defaultValue[0];
      } else {
        this.configs.defaultValue = '';
      }
    }
  }

  private handleAddOption() {
    this.configs.options.push({
      value: 'OptionX',
      text: '新选项',
    });
  }

  handleOptionsRemove(index: number) {
    this.$confirm({
      content: '确定删除吗？',
      onOk: () => {
        this.configs.options.splice(index, 1);
      },
    });
  }

  render() {
    return (
      <div>
        <a-drawer
          title="列配置"
          placement="right"
          visible={this.visible}
          destroyOnClose={true}
          bodyStyle={{ padding: '16px 10px 20px' }}
          wrapClassName="page-designer-table-config"
          onClose={() => {
            this.handleClose(false);
          }}
        >
          <a-divider>标题</a-divider>
          <div class="feild-item">
            <a-input style="width: 100%;" vModel={this.configs.title} />
          </div>
          <a-divider>字段标识</a-divider>
          <div class="feild-item">
            <a-input vModel={this.configs.dataIndex} />
          </div>
          <a-divider>列类型</a-divider>
          <div class="feild-item">
            <a-select vModel={this.configs.type}>
              <a-select-option value="data">数据列</a-select-option>
              <a-select-option value="template">模板列</a-select-option>
              <a-select-option value="opration">操作列</a-select-option>
            </a-select>
          </div>
          <a-divider>是否支持筛选</a-divider>
          <div class="feild-item">
            <a-switch vModel={this.configs.isFilter} />
          </div>
          {this.configs.isFilter && [
            <a-divider>筛选时是否多选</a-divider>,
            <div class="feild-item">
              <a-switch vModel={this.configs.filterMultiple} onChange={this.handleSelectMuliple} />
            </div>,
            !this.configs.remote && [
              <a-divider>是否显示标签</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.configs.showLabel} />
                </div>
              </a-form-model-item>,
            ],
            <a-divider>筛选选项配置</a-divider>,
            <div class="feild-item" style="width: 100%; margin-bottom: 20px;">
              <a-radio-group vModel={this.configs.remote} buttonStyle="solid">
                <a-radio-button value={false}>静态数据</a-radio-button>
                <a-radio-button value={true}>远端数据</a-radio-button>
              </a-radio-group>
            </div>,
            this.configs.remote ? (
              <div class="feild-item" style="width: 100%;">
                <a-input addon-before="远端方法" vModel={this.configs.remoteFunc} />
                <a-input
                  addon-before="值"
                  vModel={this.configs.props.value}
                  style="margin: 10px 0;"
                />
                <a-input
                  addon-before="标签"
                  vModel={this.configs.props.text}
                  style="margin-bottom: 10px;"
                />
              </div>
            ) : !this.configs.filterMultiple ? (
              <a-radio-group vModel={this.configs.defaultValue}>
                <Draggable
                  tag="ul"
                  list={this.configs.options}
                  group={{ name: 'options' }}
                  ghostClass="ghost"
                  handle=".drag-item"
                  class="drag-sort"
                >
                  {this.configs.options.map((item: any, index: number) => {
                    return (
                      <li key={index}>
                        <a-radio
                          value={item.value}
                          style="margin-right: 0; white-space: nowrap; width: 168px;"
                        >
                          <a-input
                            style={{
                              width: this.configs.showLabel ? '68px' : '136px',
                            }}
                            vModel={item.value}
                          />
                          {this.configs.showLabel && (
                            <a-input style="width:68px;" vModel={item.text} />
                          )}
                        </a-radio>
                        <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                        <a-popconfirm
                          title="确定删除吗？"
                          placement="left"
                          onConfirm={() => {
                            this.configs.options.splice(index, 1);
                          }}
                        >
                          <a-button icon="delete" type="danger"></a-button>
                        </a-popconfirm>
                      </li>
                    );
                  })}
                </Draggable>
              </a-radio-group>
            ) : (
              <a-checkbox-group vModel={this.configs.defaultValue}>
                <Draggable
                  tag="ul"
                  list={this.configs.options}
                  group={{ name: 'options' }}
                  ghostClass="ghost"
                  handle=".drag-item"
                  class="drag-sort"
                >
                  {this.configs.options.map((item: any, index: number) => {
                    return (
                      <li key={index}>
                        <a-checkbox
                          value={item.value}
                          style="margin-right: 0; white-space: nowrap; width: 168px;"
                        >
                          <a-input
                            style={{
                              width: this.configs.showLabel ? '68px' : '136px',
                            }}
                            vModel={item.value}
                          />
                          {this.configs.showLabel && (
                            <a-input style="width:68px;" vModel={item.text} />
                          )}
                        </a-checkbox>
                        <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                        <a-popconfirm
                          title="确定删除吗？"
                          placement="left"
                          ok-text="Yes"
                          cancel-text="No"
                          onConfirm={() => {
                            this.configs.options.splice(index, 1);
                          }}
                        >
                          <a-button icon="delete" type="danger"></a-button>
                        </a-popconfirm>
                      </li>
                    );
                  })}
                </Draggable>
              </a-checkbox-group>
            ),
            !this.configs.remote && (
              <div style="margin-left: 22px;">
                <a-button type="link" onClick={this.handleAddOption}>
                  添加选项
                </a-button>
              </div>
            ),
          ]}
          <a-divider>排序方式</a-divider>
          <div class="feild-item">
            <a-select vModel={this.configs.sorterType}>
              <a-select-option value="default">不排序</a-select-option>
              <a-select-option value="server">服务端排序</a-select-option>
              <a-select-option value="local">本地排序</a-select-option>
            </a-select>
          </div>
          {this.configs.sorterType === 'local' && [
            <a-divider>排序函数</a-divider>,
            <div class="feild-item">
              <a-input type="textarea" rows={5} vModel={this.configs.sorterFunc} />
            </div>,
          ]}
          <a-divider>对齐方式</a-divider>
          <div class="feild-item">
            <a-select vModel={this.configs.align}>
              <a-select-option value="left">左对齐</a-select-option>
              <a-select-option value="center">居中对齐</a-select-option>
              <a-select-option value="right">右对齐</a-select-option>
            </a-select>
          </div>
          <a-divider>是否自动省略</a-divider>
          <div class="feild-item">
            <a-switch vModel={this.configs.ellipsis} />
          </div>
          <a-divider>列固定位置</a-divider>
          <div class="feild-item">
            <a-select vModel={this.configs.fixed}>
              <a-select-option value="">不固定</a-select-option>
              <a-select-option value="left">左边固定</a-select-option>
              <a-select-option value="right">右边固定</a-select-option>
            </a-select>
          </div>
          <a-divider>宽度</a-divider>
          <div class="feild-item">
            <a-input vModel={this.configs.width} />
          </div>
        </a-drawer>
      </div>
    );
  }
}
