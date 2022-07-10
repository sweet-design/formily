import { Vue, Component, Prop } from 'vue-property-decorator';
import EditableCell from '../MateComponents/TTable/EditableCell';

@Component
export default class GenerateTable extends Vue {
  /**
   * 单个控件配置信息
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  widget!: any;

  /**
   * 远端数据操作方法
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: any;

  private copyWidget: any = null; // 将所有的配置深度拷贝

  // 演示数据
  private dataSource = [
    {
      keys: 1,
      name: '张三',
      age: 60,
      address: 'New York No. 1 Lake Park',
    },
    {
      keys: 2,
      name: '李四',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      keys: 3,
      name: '王五',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      keys: 4,
      name: '赵六',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      keys: 5,
      name: '其他',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  /**
   * 字符串转函数
   * @param obj 字符串函数实例化
   * @returns Function
   */
  private executeStr(obj: string) {
    return Function('"use strict";return (' + obj + ')')();
  }

  private rowSelection: any = {};

  created() {
    this.copyWidget = JSON.parse(JSON.stringify(this.widget));

    this.copyWidget.columns.forEach((item: any) => {
      if (item.sorterType == 'server') {
        item.sorter = true;
      } else if (item.sorterType == 'local' && item.sorterFunc.trim() !== '') {
        item.sorter = this.executeStr(item.sorterFunc);
      }

      if (item.isFilter) {
        if (item.remote) {
          if (this.remote[item.remoteFunc]) {
            this.remote[item.remoteFunc]((data: any) => {
              item.remoteOptions = data.map((sub: any) => {
                return {
                  value: sub[item.props.value],
                  text: item.showLabel ? sub[item.props.text] : sub[item.props.value],
                };
              });

              item.filters = item.remoteOptions;
            });
          }
        } else {
          if (!item.showLabel) {
            item.filters = item.options.map((ele: any) => ({
              value: ele.value,
              text: ele.value,
            }));
          } else {
            item.filters = item.options;
          }

          item.defaultFilteredValue = item.filterMultiple
            ? item.defaultValue
            : item.defaultValue == ''
            ? []
            : [item.defaultValue];
        }
      }

      item.scopedSlots = { customRender: item.dataIndex };
    });

    /* if (this.widget.type === 'imgupload' && this.widget.options.isAliyun) {
			this.remote[this.widget.options.tokenFunc]((data: any) => {
				this.widget.options.token = data;
			});
		} */

    if (this.copyWidget.showSelectCol) {
      const temp = { ...this.copyWidget.rowSelection };

      // 目前内置默认有onChange事件
      Object.keys(temp).forEach((item: string) => {
        if (item === 'onChange' && temp.onChange !== '') {
          temp.onChange = this.executeStr(temp.onChange);
        }
      });

      this.rowSelection = temp;
    }
  }

  private handleTableChange(pagination: any, filters: any, sorter: any) {
    console.log(pagination);
    console.log(filters);
    console.log(sorter);
  }

  protected render() {
    return (
      <div style="margin-top: 20px;">
        <a-table
          rowKey={this.copyWidget.primaryKey}
          pagination={this.copyWidget.page ? this.copyWidget.pagination : false}
          scroll={{ x: this.copyWidget.width, y: this.copyWidget.height }}
          bordered={this.copyWidget.border}
          columns={this.copyWidget.columns}
          data-source={this.dataSource}
          size={this.copyWidget.size}
          row-selection={this.copyWidget.showSelectCol ? this.rowSelection : null}
          onChange={this.handleTableChange}
          scopedSlots={(() => {
            const objs: any = {};
            this.copyWidget.columns.forEach((element: any) => {
              // 模板列，自动读取表单配置中字段的相关属性，通过dataIndex关联
              if (element.type === 'template') {
                objs[element.dataIndex] = (text: string, record: any) => {
                  return (
                    <EditableCell
                      text={text}
                      onChange={(value: any) => {
                        const dataSource = [...this.dataSource];
                        const target = dataSource.find(
                          (item: any) =>
                            item[this.copyWidget.primaryKey] === record[this.copyWidget.primaryKey],
                        );
                        if (target) {
                          target.name = value;
                          this.dataSource = dataSource;
                        }
                      }}
                    />
                  );
                };
              }
            });

            return objs;
          })()}
        />
      </div>
    );
  }
}
