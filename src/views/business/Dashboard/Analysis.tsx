import { Vue, Component } from 'vue-property-decorator';
import ScrollPosition from '@/utils/scrollPosition';

@Component
export default class Analysis extends Vue {
  async mounted() {
    ScrollPosition.get.call(this);
  }

  activated() {
    ScrollPosition.get.call(this);
  }

  handleSearch(e: Event) {
    e.preventDefault();
  }

  created() {
    this.form = this.$form.createForm(this, { name: 'advanced_search' });
  }

  private form: any = null;
  private advanced = false;
  private fieldCount = 6;
  private selectedRowKeys: string[] = []; // 选中行的数据
  private columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
  ];

  private data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '5',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '6',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '7',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '8',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '9',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '10',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  get rowSelection() {
    return {
      onChange: (selectedRowKeys: string[], selectedRows: string[]) => {
        this.selectedRowKeys = selectedRowKeys;
      },
      getCheckboxProps: (record: any) => ({
        props: {
          disabled: record.name === 'Lebron', // Column configuration not to be checked
          name: record.name,
        },
      }),
    };
  }

  get cols() {
    return this.advanced && this.fieldCount % 3 == 0 ? 24 : 8;
  }

  render() {
    return (
      <div class="analysis-wrapper">
        <a-card bordered={false}>
          {/* 查询栏 */}
          <div class="table-page-search-wrapper">
            <a-form layout="inline" form={this.form} onSubmit={this.handleSearch}>
              <a-row gutter={48}>
                <a-col span={8}>
                  <a-form-item label="规则编号">
                    <a-input v-decorator={['id']} placeholder="" />
                  </a-form-item>
                </a-col>
                <a-col span={8}>
                  <a-form-item label="使用状态">
                    <a-select v-decorator={['status']} placeholder="请选择">
                      <a-select-option value="0">全部</a-select-option>
                      <a-select-option value="1">关闭</a-select-option>
                      <a-select-option value="2">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                {this.advanced
                  ? [
                      <a-col span={8}>
                        <a-form-item label="调用次数">
                          <a-input-number v-decorator={['callNo']} style="width: 100%" />
                        </a-form-item>
                      </a-col>,
                      <a-col span={8}>
                        <a-form-item label="更新日期">
                          <a-date-picker
                            v-decorator={['date']}
                            style="width: 100%"
                            placeholder="请输入更新日期"
                          />
                        </a-form-item>
                      </a-col>,
                      <a-col span={8}>
                        <a-form-item label="使用状态">
                          <a-select
                            v-decorator={[
                              'useStatus',
                              {
                                initialValue: '0',
                              },
                            ]}
                            placeholder="请选择"
                          >
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">关闭</a-select-option>
                            <a-select-option value="2">运行中</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>,
                      <a-col span={8}>
                        <a-form-item label="其他状态">
                          <a-select
                            placeholder="请选择"
                            v-decorator={[
                              'otherStatus',
                              {
                                initialValue: '0',
                              },
                            ]}
                          >
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">关闭</a-select-option>
                            <a-select-option value="2">运行中</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>,
                    ]
                  : null}
                <a-col span={this.cols} style={{ textAlign: this.cols === 8 ? 'left' : 'right' }}>
                  <span class="table-page-search-submitButtons">
                    <a-button
                      type="primary"
                      onClick={() => {
                        this.$message.success('准备查询');
                      }}
                    >
                      {this.$t('form.basic-form.form.search')}
                    </a-button>
                    <a-button
                      style={{ marginLeft: '8px' }}
                      onClick={() => {
                        this.form.resetFields();
                      }}
                    >
                      {this.$t('form.basic-form.form.reset')}
                    </a-button>
                    <a
                      style={{ marginLeft: '8px' }}
                      onClick={() => {
                        this.advanced = !this.advanced;
                      }}
                    >
                      {this.advanced ? '收起' : '展开'}
                      <a-icon type={this.advanced ? 'up' : 'down'} />
                    </a>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          {/* 工具栏 */}
          <div class="table-operator">
            <a-button
              type="primary"
              icon="plus"
              {...{ directives: [{ name: 'action', arg: 'add' }] }}
              onClick={() => {}}
            >
              {this.$t('add')}
            </a-button>
            {this.selectedRowKeys.length > 0 && (
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item key="1">
                    <a-icon type="delete" />
                    {this.$t('delete')}
                  </a-menu-item>

                  <a-menu-item key="2">
                    <a-icon type="lock" />
                    {this.$t('lock')}
                  </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                  {this.$t('batch.operation')} <a-icon type="down" />
                </a-button>
              </a-dropdown>
            )}
          </div>
          {/* 数据栏 */}
          <div class="table-wrapper">
            <a-table
              row-selection={this.rowSelection}
              columns={this.columns}
              data-source={this.data}
              pagination={{
                position: 'bottom',
                showSizeChanger: true,
                defaultCurrent: 3,
                total: 500,
                onChange: (page: number) => {
                  this.$message.success(`已切换到第${page}页`);
                },
                onShowSizeChange: (current: number, pageSize: number) => {
                  this.$message.success(`当前第${current}页，每页显示${pageSize}条数据`);
                },
              }}
              scopedSlots={{
                name: (text: string) => {
                  return <a>{text}</a>;
                },
              }}
            ></a-table>
          </div>
        </a-card>
      </div>
    );
  }
}
