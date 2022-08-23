import { Component, Prop, Mixins, Emit } from 'vue-property-decorator';
import mixin from '@/components/container/Formily/utils/mixin';
import { createHash } from '../../../../utils/format';
import { ColModel } from '../../../../Models/Array/arrayTable';
import Draggable from 'vuedraggable';
import WidgetFormItem from '../../WidgetFormItem';
import { Empty } from 'ant-design-vue';
import './index.less';

@Component
export default class ArrayTable extends Mixins(mixin) {
  /**
   * 单个字段配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  config!: any;

  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  allConfig!: any;

  /**
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  /**
   * 转换table所需要的 columns 配置数据
   */
  get columns() {
    return this.config.componentProperties.list.map((item: any) => {
      return {
        title: item.componentProperties.title,
        dataIndex: item.key,
        scopedSlots: { customRender: 'source' },
        key: item.key,
        width: item.componentProperties.width || 200,
        align: item.componentProperties.align,
        fixed: item.componentProperties.fixed,
      };
    });
  }

  /**
   * 转换table所需要的数据源，支撑在配置层所需要的数据，在应用层会是实际的数据源数据
   */
  get dataSource() {
    const arr = this.config.componentProperties.list.map((item: any) => {
      return {
        [item.key]: item.key,
      };
    });

    return [
      arr.reduce(
        (a: any, b: any) => {
          return (a = { ...a, ...b });
        },
        { key: '1' },
      ),
    ];
  }

  /**
   * 通用拖拽后的完成回调
   */
  handleMoveEnd(data: any) {
    // console.log('index', data.newIndex, data.oldIndex);
  }

  /**
   * 跟新当前选中的栅格组件
   * @param value 当前点击的栅格布局组件配置数据
   */
  @Emit('select')
  private componentSelectChangeHandle(value: any) {}

  /**
   * 删除组件，支持输入组件和布局组件
   * @param list 当前所删除的组件所在的list对象
   * @param value 当前所要删除的组件的配置数据
   */
  @Emit('remove')
  private componentRemoveHandle(list: any[], value: any, parentContainer: any) {}

  /**
   * 添加输入组件回调函数
   * @param evt 拖拽对象数据
   * @param containerList 当前列下的控件列表容器
   */
  private handleWidgetAdd(evt: any, containerList: any[]) {
    const newIndex = evt.newIndex;

    // 为拖拽到容器的元素添加唯一 key
    const key = createHash(12);

    this.$set(containerList, newIndex, { ...containerList[newIndex], key });

    this.$set(containerList, newIndex, JSON.parse(JSON.stringify(containerList[newIndex])));

    // 增加后默认取当前选中的对象
    this.componentSelectChangeHandle(containerList[newIndex]);
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    return (
      <div class="array-table-wrapper" style="width: 100%">
        {componentProperties.list.length === 0 && (
          <div class="array-table-wrapper__content">
            <div>自增表格</div>
          </div>
        )}

        {componentProperties.list.length > 0 && (
          <div style="width: 100%; overflow: auto;">
            <a-table
              columns={this.columns}
              dataSource={this.dataSource}
              bordered={componentProperties.bordered}
              showHeader={componentProperties.showHeader}
              tableLayout={componentProperties.tableLayout}
              pagination={false}
              size={componentProperties.size ?? formConfig.size}
              scopedSlots={{
                /**
                 * 自定义列的渲染
                 * @param data 当前列的key
                 */
                source: (data: any) => {
                  // 根据列的编号查询指定列下的配置数据
                  const temp = componentProperties.list.find((item: any) => item.key === data);

                  // 如果列类型为索引列，直接返回字符 1
                  if (temp.componentProperties.colType === 'index') {
                    return '1';
                  }

                  // 如果列类型为操作列，需返回操作按钮列表
                  if (temp.componentProperties.colType === 'opt') {
                    return (
                      <a-space>
                        <a-icon type="up" onClick={() => {}} />
                        <a-icon type="down" onClick={() => {}} />
                        <a-icon type="delete" onClick={() => {}} />
                      </a-space>
                    );
                  }

                  return (
                    <div class="array-table-wrapper__table">
                      {/* {temp.componentProperties.list.length === 0 && (
                        <a-empty
                          image={(Empty as any).PRESENTED_IMAGE_SIMPLE}
                          class="empty"
                        ></a-empty>
                      )} */}
                      <Draggable
                        vModel={temp.componentProperties.list}
                        group="people"
                        acceptCompType={['input']}
                        ghostClass="ghost"
                        animation={200}
                        handle=".drag-widget"
                        onEnd={this.handleMoveEnd}
                        onAdd={(evt: any) => {
                          this.handleWidgetAdd(evt, temp.componentProperties.list);
                        }}
                      >
                        <transition-group
                          name="fade"
                          tag="div"
                          class="widget-form-wrapper-list"
                          style="min-height: 70px"
                        >
                          {temp.componentProperties.list.map((item: any) => {
                            return (
                              item.key && (
                                <WidgetFormItem
                                  key={item.key}
                                  allConfig={this.allConfig}
                                  data={item}
                                  select={this.select}
                                  onSelect={(data: any) => {
                                    this.componentSelectChangeHandle(data);
                                  }}
                                  list={temp.componentProperties.list}
                                  // 注意：理论上将列作为父级容器，此处需要将自增表格作为父级容器，因为目前列不允许被选中进行配置
                                  parentContainer={this.config}
                                  onRemove={(list: any[], data: any, parentContainer: any) => {
                                    this.componentRemoveHandle(list, data, parentContainer);
                                  }}
                                ></WidgetFormItem>
                              )
                            );
                          })}
                        </transition-group>
                      </Draggable>
                    </div>
                  );
                },
              }}
            ></a-table>
          </div>
        )}

        {/* <div style="margin-top: 10px;">
          <a-button type="dashed" icon="plus" block>
            添加
          </a-button>
        </div> */}

        <div class="array-table-wrapper__opt">
          <a-space>
            <a-button
              type="link"
              onClick={() => {
                const result = componentProperties.list.find(
                  (item: any) => item.componentProperties.colType === 'index',
                );

                if (!result) {
                  const temp = {
                    key: createHash(12),
                    ...JSON.parse(JSON.stringify(ColModel)),
                  };

                  temp.componentProperties.colType = 'index';
                  componentProperties.list.unshift(temp);
                }
              }}
            >
              添加索引
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              onClick={() => {
                componentProperties.list.push({
                  key: createHash(12),
                  ...JSON.parse(JSON.stringify(ColModel)),
                });
              }}
            >
              添加列
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              onClick={() => {
                const result = componentProperties.list.find(
                  (item: any) => item.componentProperties.colType === 'opt',
                );

                if (!result) {
                  const temp = {
                    key: createHash(12),
                    ...JSON.parse(JSON.stringify(ColModel)),
                  };

                  temp.componentProperties.colType = 'opt';
                  componentProperties.list.push(temp);
                }
              }}
            >
              添加操作
            </a-button>
          </a-space>
        </div>
      </div>
    );
  }
}
