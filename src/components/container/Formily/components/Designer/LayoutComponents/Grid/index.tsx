import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import classnames from 'classnames';
import Draggable from 'vuedraggable';
import Dayjs from 'dayjs';
import WidgetFormItem from '../../WidgetFormItem';
import { createHash } from '../../../../utils/format';
import './index.less';

@Component
export default class Grid extends Vue {
  /**
   * 栅格组件配置数据，包含子级配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any;

  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  allConfig!: any;

  /**
   * 当前组件所在的对应的list对象
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  list!: any[];

  /**
   * 当前组件所在的对应的父级对象
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  parentContainer!: any;

  /**
   * 当前选中的组件配置数据模型，支持布局组件和输入组件
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  select!: any;

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
   * @param $event 拖拽对象数据
   * @param row 行的数据
   * @param colIndex 当前组件所在的列的索引
   */
  private handleWidgetAdd($event: any, row: any, colIndex: number) {
    const newIndex = $event.newIndex;

    const key = createHash(12);

    this.$set(row.componentProperties.columns[colIndex].list, newIndex, {
      ...row.componentProperties.columns[colIndex].list[newIndex],
      key,
    });

    this.$set(
      row.componentProperties.columns[colIndex].list,
      newIndex,
      JSON.parse(JSON.stringify(row.componentProperties.columns[colIndex].list[newIndex])),
    );

    this.componentSelectChangeHandle(row.componentProperties.columns[colIndex].list[newIndex]);
  }

  /**
   * 通用拖拽后的完成回调
   */
  handleMoveEnd(data: any) {
    // console.log('index', data.newIndex, data.oldIndex);
  }

  render() {
    return (
      <div class="layout-component-grid">
        <a-row
          class={classnames('layout-component-grid__row', {
            active: this.select.key === this.data.key,
          })}
          type="flex"
          gutter={this.data.componentProperties.gutter}
          justify={this.data.componentProperties.justify}
          align={this.data.componentProperties.align}
          nativeOnClick={(e: Event) => {
            e.stopPropagation();
            this.componentSelectChangeHandle(this.data);
          }}
          style="margin: 0;"
        >
          {this.data.componentProperties.columns.map((col: any, colIndex: number) => {
            return (
              <a-col
                key={colIndex}
                span={col.span}
                style={{
                  opacity: this.data.fieldProperties.display === 'visible' ? '100%' : '0',
                }}
              >
                <Draggable
                  vModel={col.list}
                  group="people"
                  acceptCompType={['input']}
                  ghostClass="ghost"
                  animation={200}
                  handle=".drag-widget"
                  onEnd={this.handleMoveEnd}
                  onAdd={(evt: any) => {
                    this.handleWidgetAdd(evt, this.data, colIndex);
                  }}
                >
                  <transition-group name="fade" tag="div" class="layout-component-grid__row-list">
                    {col.list.map((item: any) => {
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
                            list={col.list}
                            parentContainer={this.data}
                            onRemove={(list: any[], data: any, parentContainer: any) => {
                              this.componentRemoveHandle(list, data, parentContainer);
                            }}
                          ></WidgetFormItem>
                        )
                      );
                    })}
                  </transition-group>
                </Draggable>
              </a-col>
            );
          })}
          {this.select.key == this.data.key && [
            <div class="layout-component-grid__row-action" style="top: 0; right: 28px;">
              <a-tooltip placement="right" title="删除栅格">
                <a-icon
                  type="delete"
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    this.componentRemoveHandle(this.list, this.data, this.parentContainer);
                  }}
                />
              </a-tooltip>
            </div>,
            <div class="layout-component-grid__row-drag" style="top: 0; cursor: move;">
              <a-tooltip placement="right" title="拖拽排序">
                <a-icon type="drag" class="drag-widget" />
              </a-tooltip>
            </div>,
          ]}
        </a-row>
      </div>
    );
  }
}
