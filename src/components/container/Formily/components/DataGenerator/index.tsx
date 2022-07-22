import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { createHash } from '../../utils/format';
import './index.less';

@Component
export default class DataGenerator extends Vue {
  /**
   * 当前选中的组件的静态数据源
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  data!: any[];

  private shadowData: any = null;

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

  // 递归寻找节点，并执行自定义函数
  private loop = (data: any[], key: string, callback: Function) => {
    data.forEach((item, index, arr) => {
      if (item.key === key) {
        return callback(item, index, arr);
      }
      if (item.children) {
        return this.loop(item.children, key, callback);
      }
    });
  };

  // 当前选中的数据
  private current: any = null;
  // 当前选中的节点key
  private selectKey = '';

  private indentData(data: any[]) {
    let result = '';

    for (let i = 0; i < data.length; i++) {
      if (data[i].keyName !== '' || data[i].keyValue !== '') {
        result = data[i].keyValue;
        break;
      } else {
        result = '默认标题';
      }
    }

    return result;
  }

  /**
   * 数据处理工厂
   * @param params 待处理数据
   * @returns 新数据
   */
  private dataFactory(params: any[]) {
    const loop = (data: any[]) => {
      return data.map(item => {
        const obj: any = {};

        item.list.forEach((element: any) => {
          if (element.keyName.trim() !== '') {
            obj[element.keyName] = element.keyValue;
          }

          if (item.children && item.children.length > 0) {
            obj.children = loop(item.children);
          }
        });

        return obj;
      });
    };

    return loop(params);
  }

  created() {
    const loop = (data: any[]): any[] => {
      return data.map(item => {
        return {
          key: createHash(12),
          scopedSlots: {
            title: 'delete',
          },
          children: (item.children && item.children.length > 0 && loop(item.children)) || [],
          list: Object.keys(item)
            .filter(item => item !== 'children')
            .map(sub => {
              return {
                keyName: sub,
                keyValue: item[sub],
              };
            }),
        };
      });
    };

    this.shadowData = loop(JSON.parse(JSON.stringify(this.data)));
  }

  render() {
    return (
      <a-modal
        visible
        title="静态数据"
        keyboard={false}
        maskClosable={false}
        width={1000}
        centered
        getContainer={() => {
          return document.querySelector('.property-config-wrapper');
        }}
        onOk={() => {
          this.handleConfirm(this.dataFactory(this.shadowData));
        }}
        onCancel={() => {
          this.handleCancel();
        }}
      >
        <div class="data-generator-wrapper">
          <a-alert
            message="以下支持多语言，默认key为lang，请不要随意修改，目前键值的类型只支持string类型，如需其他支持，请联系LeBron"
            type="info"
            show-icon
            style="margin-bottom: 10px;"
          />

          <a-row class="data-generator-wrapper__content">
            <a-col span={8} class="data-generator-wrapper__content-col">
              <a-row
                justify="space-between"
                type="flex"
                align="middle"
                class="data-generator-wrapper__content-col-top"
              >
                <a-col>可选项节点树</a-col>
                <a-col>
                  <a-button
                    icon="plus"
                    onClick={() => {
                      this.shadowData.push({
                        key: createHash(12),
                        children: [],
                        scopedSlots: {
                          title: 'delete',
                        },
                        list: [
                          {
                            keyName: 'label',
                            keyValue: `选项${this.shadowData.length + 1}`,
                          },
                          {
                            keyName: 'value',
                            keyValue: createHash(12),
                          },
                          {
                            keyName: 'lang',
                            keyValue: '',
                          },
                        ],
                      });
                    }}
                  >
                    新增节点
                  </a-button>
                </a-col>
              </a-row>
              <div class="data-generator-wrapper__content-col-data">
                {this.shadowData.length === 0 && (
                  <a-empty image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original" />
                )}
                <a-tree
                  class="draggable-tree"
                  blockNode
                  showLine
                  draggable
                  treeData={this.shadowData}
                  onDragenter={() => {}}
                  onDrop={(info: any) => {
                    // 目标容器节点key
                    const dropKey = info.node.eventKey;
                    // 拖拽的节点key
                    const dragKey = info.dragNode.eventKey;
                    // 目标容器节点所在的路径系统中的分割
                    const dropPos = info.node.pos.split('-');
                    // 拖拽对象放置的位置(目标对象若为节点容器，即节点容器所在的索引，若为gap，即此gap所在的索引，特别情况是在最顶部，值为-1) - 目标容器节点自身位置索引
                    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

                    const data = [...this.shadowData];

                    // 拖拽的数据对象
                    let dragObj: any = null;

                    // 提取出拖拽对象，并消除原来位置信息
                    this.loop(data, dragKey, (item: any, index: number, arr: any[]) => {
                      arr.splice(index, 1);
                      dragObj = item;
                    });

                    // 放置的不是 gap 而是 container，即识别的是节点容器，而不是节点位置
                    if (!info.dropToGap) {
                      this.loop(data, dropKey, (item: any) => {
                        item.children = item.children || [];
                        // 默认追加到最后，可以自定义其他位置
                        item.children.push(dragObj);
                      });
                    } else if (
                      (info.node.children || []).length > 0 && // Has children
                      info.node.expanded && // Is expanded
                      dropPosition === 1 // On the bottom gap
                    ) {
                      this.loop(data, dropKey, (item: any) => {
                        item.children = item.children || [];
                        // where to insert 示例添加到尾部，可以是随意位置
                        item.children.unshift(dragObj);
                      });
                    } else {
                      let tempArr: any = null;
                      let idx = 0;

                      this.loop(data, dropKey, (item: any, index: number, arr: any[]) => {
                        tempArr = arr;
                        idx = index;
                      });

                      if (dropPosition === -1) {
                        tempArr.splice(idx, 0, dragObj);
                      } else {
                        tempArr.splice(idx + 1, 0, dragObj);
                      }
                    }

                    this.shadowData = data;
                  }}
                  scopedSlots={{
                    delete: (data: any) => {
                      return (
                        <div
                          class="draggable-tree__title"
                          onClick={() => {
                            this.current = data.list;
                            this.selectKey = data.key;
                          }}
                        >
                          <a-row justify="space-between" type="flex" align="middle">
                            <a-col>{this.indentData(data.list)}</a-col>
                            <a-col>
                              <a-icon
                                type="delete"
                                class="delete-icon"
                                onClick={(e: Event) => {
                                  e.stopPropagation();
                                  this.loop(
                                    this.shadowData,
                                    data.key,
                                    (item: any, index: number, arr: any[]) => {
                                      arr.splice(index, 1);
                                    },
                                  );

                                  if (data.key === this.selectKey) {
                                    this.current = null;
                                  }
                                }}
                              />
                            </a-col>
                          </a-row>
                        </div>
                      );
                    },
                  }}
                ></a-tree>
              </div>
            </a-col>
            <a-col span={16} class="data-generator-wrapper__content-col">
              <a-row
                justify="space-between"
                type="flex"
                align="middle"
                class="data-generator-wrapper__content-col-top"
              >
                <a-col>节点属性</a-col>
                <a-col>
                  {this.current && (
                    <a-button
                      icon="plus"
                      onClick={() => {
                        this.current.push({
                          keyName: '',
                          keyValue: '',
                        });
                      }}
                    >
                      新增键值对
                    </a-button>
                  )}
                </a-col>
              </a-row>
              <div class="data-generator-wrapper__content-col-data">
                {(!this.current || this.current.length === 0) && (
                  <a-empty image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original" />
                )}
                {this.current &&
                  this.current.length > 0 &&
                  this.current.map((item: any, index: number) => {
                    return (
                      <a-row
                        type="flex"
                        align="middle"
                        justify="space-between"
                        class="draggable-tree-detail"
                      >
                        <a-col>键名：</a-col>
                        <a-col>
                          <a-input vModel={item.keyName} placeholder="请输入" />
                        </a-col>
                        <a-col>键值：</a-col>
                        <a-col>
                          <a-input vModel={item.keyValue} placeholder="请输入" />
                        </a-col>
                        <a-col>
                          <a-button
                            icon="delete"
                            type="danger"
                            onClick={() => {
                              this.current.splice(index, 1);
                            }}
                          ></a-button>
                        </a-col>
                      </a-row>
                    );
                  })}
              </div>
            </a-col>
          </a-row>
        </div>
      </a-modal>
    );
  }
}
