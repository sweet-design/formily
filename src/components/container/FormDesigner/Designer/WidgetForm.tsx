import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import classnames from 'classnames';
import Dayjs from 'dayjs';
import WidgetFormItem from './WidgetFormItem';
import './WidgetForm.less';

@Component
export default class WidgetForm extends Vue {
  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any;

  /**
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  select!: any;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  /**
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  private selectWidget = this.select;

  @Watch('select')
  selectHandle(val: any) {
    this.selectWidget = val;
  }

  @Emit('update:select')
  protected updateSelect(val: any) {}

  @Watch('selectWidget', { deep: true })
  protected selectWidgetHandle(val: any) {
    this.updateSelect(val);
  }

  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  }

  /**
   * 通用拖拽后的完成回调
   */
  handleMoveEnd(data: any) {
    // console.log('index', data.newIndex, data.oldIndex);
  }

  /**
   * 添加布局字段后的回调函数
   * @param evt 拖拽事件对象
   */
  handleWidgetAdd(evt: any) {
    const newIndex = evt.newIndex;

    // 为拖拽到容器的元素添加唯一 key
    const key = Dayjs().valueOf();

    this.$set(this.data.list, newIndex, {
      ...this.data.list[newIndex],
      options: {
        ...this.data.list[newIndex].options,
        remoteFunc: 'func_' + key,
      },
      key,
      model: this.data.list[newIndex].type + '_' + key,
      rules: [],
    });

    this.$set(this.data.list, newIndex, JSON.parse(JSON.stringify(this.data.list[newIndex])));

    // 增加后默认取当前选中的对象

    this.selectWidget = this.data.list[newIndex];
  }

  /**
   * 切换选择布局字段后更新当前选中的字段配置数据
   * @param index 当前布局字段索引
   */
  handleSelectWidget(index: number) {
    this.selectWidget = this.data.list[index];
  }

  /**
   * 更新当前非布局字段选中的数据
   * @param value 选中的非布局字段数据
   */
  updateSelectWidget(value: any) {
    this.selectWidget = value;
  }

  /**
   * 添加基础或高级字段后的回调函数
   * @param $event 拖拽对象数据
   * @param row 行的数据
   * @param colIndex 当前组件所在的列的索引
   */
  handleWidgetColAdd($event: any, row: any, colIndex: number) {
    const newIndex = $event.newIndex;
    const oldIndex = $event.oldIndex;
    const item = $event.item; // DOM对象
    // 防止布局元素的嵌套拖拽
    if (item.className.indexOf('data-grid') >= 0) {
      // 如果是列表中拖拽的元素需要还原到原来位置
      item.tagName === 'DIV' &&
        this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
      row.columns[colIndex].list.splice(newIndex, 1);
      return false;
    }

    const key = Dayjs().valueOf();
    this.$set(row.columns[colIndex].list, newIndex, {
      ...row.columns[colIndex].list[newIndex],
      options: {
        ...row.columns[colIndex].list[newIndex].options,
        remoteFunc: row.columns[colIndex].list[newIndex].options.remoteFunc || 'func_' + key,
      },
      key,
      // 绑定键值
      model:
        row.columns[colIndex].list[newIndex].model ||
        row.columns[colIndex].list[newIndex].type + '_' + key,
      rules: [],
    });

    this.$set(
      row.columns[colIndex].list,
      newIndex,
      JSON.parse(JSON.stringify(row.columns[colIndex].list[newIndex])),
    );

    this.selectWidget = row.columns[colIndex].list[newIndex];
  }

  /**
   * 删除布局字段数据
   * @param index 当前布局字段所在的索引
   */
  handleWidgetDelete(index: number) {
    this.$confirm({
      content: '确定删除吗？',
      onOk: () => {
        // 删除后 默认选中的规则：自己悟
        if (this.data.list.length - 1 === index) {
          if (index === 0) {
            this.selectWidget = {};
          } else {
            this.selectWidget = this.data.list[index - 1];
          }
        } else {
          this.selectWidget = this.data.list[index + 1];
        }

        this.$nextTick(() => {
          this.data.list.splice(index, 1);
          this.$message.success('删除成功');
        });
      },
    });
  }

  render() {
    return (
      <div class="widget-form-container custom-horizontal-wrapper">
        {this.data.list.length <= 0 && <a-empty class="empty" />}
        <a-form
          labelAlign={this.data.config.labelAlign}
          labelCol={{ span: this.data.config.labelCol }}
          wrapperCol={{ span: 24 - this.data.config.labelCol }}
          style="height: 100%"
        >
          <Draggable
            class=""
            vModel={this.data.list}
            group="people"
            ghostClass="ghost"
            animation={200}
            handle=".drag-widget"
            onEnd={this.handleMoveEnd}
            onAdd={this.handleWidgetAdd}
            style="height: 100%;"
          >
            <transition-group name="fade" tag="div" class="widget-form-list">
              {this.data.list.map((item: any, index: number) => {
                if (item.type === 'grid') {
                  return (
                    item &&
                    item.key && (
                      <a-row
                        class={classnames('widget-col', 'widget-view', {
                          active: this.selectWidget.key === item.key,
                        })}
                        key={item.key}
                        type="flex"
                        gutter={item.options.gutter}
                        justify={item.options.justify}
                        align={item.options.align}
                        nativeOnClick={() => {
                          this.handleSelectWidget(index);
                        }}
                        style="margin: 0;"
                      >
                        {item.columns.map((col: any, colIndex: number) => {
                          return (
                            <a-col key={colIndex} span={col.span}>
                              <Draggable
                                vModel={col.list}
                                group="people"
                                ghostClass="ghost"
                                animation={200}
                                handle=".drag-widget"
                                onEnd={this.handleMoveEnd}
                                onAdd={(evt: any) => {
                                  this.handleWidgetColAdd(evt, item, colIndex);
                                }}
                              >
                                <transition-group name="fade" tag="div" class="widget-col-list">
                                  {col.list.map((el: any, i: number) => {
                                    return (
                                      el.key && (
                                        <WidgetFormItem
                                          key={el.key}
                                          element={el}
                                          index={i}
                                          select={this.selectWidget}
                                          plugins={this.plugins}
                                          on={{
                                            ['update:select']: this.updateSelectWidget,
                                          }}
                                          data={col}
                                          globalConfig={this.data.config}
                                        ></WidgetFormItem>
                                      )
                                    );
                                  })}
                                </transition-group>
                              </Draggable>
                            </a-col>
                          );
                        })}
                        {this.selectWidget.key == item.key && [
                          <div
                            class="widget-view-action widget-col-action"
                            style="top: 0; right: 28px;"
                          >
                            <a-tooltip placement="right" title="删除栅格">
                              <a-icon
                                type="delete"
                                onClick={() => {
                                  this.handleWidgetDelete(index);
                                }}
                              />
                            </a-tooltip>
                          </div>,
                          <div
                            class="widget-view-drag widget-col-drag"
                            style="top: 0; cursor: move;"
                          >
                            <a-tooltip placement="right" title="拖拽排序">
                              <a-icon type="drag" class="drag-widget" />
                            </a-tooltip>
                          </div>,
                        ]}
                      </a-row>
                    )
                  );
                } else {
                  return (
                    item &&
                    item.key && (
                      <WidgetFormItem
                        key={item.key}
                        element={item}
                        index={index}
                        select={this.selectWidget}
                        plugins={this.plugins}
                        on={{
                          ['update:select']: this.updateSelectWidget,
                        }}
                        data={this.data}
                        globalConfig={this.data.config}
                      ></WidgetFormItem>
                    )
                  );
                }
              })}
            </transition-group>
          </Draggable>
        </a-form>
      </div>
    );
  }
}
