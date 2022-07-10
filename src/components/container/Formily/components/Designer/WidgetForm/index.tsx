import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import classnames from 'classnames';
import Grid from '../LayoutComponents/Grid';
import WidgetFormItem from '../WidgetFormItem';
import { createHash } from '../../../utils/format';
import './index.less';

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
   * 当前选中的字段（输入组件，布局组件）配置数据模型
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  select!: any;

  @Emit('update:select')
  protected updateSelect(val: any) {}

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
   * 添加布局组件或者输入组件后的回调函数
   * @param evt 拖拽事件对象
   */
  private handleWidgetAdd(evt: any) {
    const newIndex = evt.newIndex;

    // 为拖拽到容器的元素添加唯一 key
    const key = createHash(12);

    this.$set(this.data.list, newIndex, { ...this.data.list[newIndex], key });

    this.$set(this.data.list, newIndex, JSON.parse(JSON.stringify(this.data.list[newIndex])));

    // 增加后默认取当前选中的对象
    this.updateSelect(this.data.list[newIndex]);
  }

  /**
   * 删除组件配置数据，支持输入组件和布局组件，默认也会删除布局组件下的输入组件等数据
   * @param list 当前所要删除的组件数据所对应的list容器
   * @param data 当前所要删除的组件数据
   * @param parentContainer 当前所要删除的组件数据对应的list容器的父级对象
   */
  private removeLayoutData(list: any[], data: any, parentContainer: any) {
    const idx = list.findIndex((item: any) => item.key === data.key);
    this.$confirm({
      content: '确定删除吗？',
      onOk: () => {
        if (list.length - 1 === idx) {
          if (idx === 0) {
            this.updateSelect(parentContainer);
          } else {
            this.updateSelect(list[idx - 1]);
          }
        } else {
          this.updateSelect(list[idx + 1]);
        }

        this.$nextTick(() => {
          list.splice(idx, 1);
          this.$message.success('删除成功');
        });
      },
    });
  }

  render() {
    const formConfig = this.data.config;

    return (
      <div
        class={classnames('widget-form-wrapper', 'custom-horizontal-wrapper', {
          active: this.select && this.select.config?.key === formConfig.key,
        })}
      >
        {this.data.list.length <= 0 && <a-empty class="empty" />}
        <a-form
          labelAlign={formConfig.labelAlign}
          props={
            formConfig.layout === 'horizontal'
              ? {
                  labelCol: { span: formConfig.labelCol },
                  wrapperCol: { span: formConfig.wrapperCol },
                }
              : null
          }
          layout={formConfig.layout}
          style={{ width: '100%', height: '100%' }}
          class={classnames(formConfig.customClass)}
        >
          <Draggable
            vModel={this.data.list}
            group="people"
            ghostClass="ghost"
            animation={200}
            handle=".drag-widget"
            acceptCompType={['layout', 'input']}
            onEnd={this.handleMoveEnd}
            onAdd={this.handleWidgetAdd}
            move={(e: any) => {
              const container = e.relatedContext.component;
              const state = container.$attrs.acceptCompType.includes('layout');
              if (e.draggedContext.element.fieldProperties.type === 'grid' && !state) return false;
              return true;
            }}
            style="height: 100%;"
          >
            <transition-group name="fade" tag="div" class="widget-form-wrapper-list">
              {this.data.list.map((item: any) => {
                if (item.fieldProperties.type === 'grid') {
                  return (
                    item &&
                    item.key && (
                      <Grid
                        data={item}
                        allConfig={this.data}
                        key={item.key}
                        select={this.select}
                        onSelect={(data: any) => {
                          this.updateSelect(data);
                        }}
                        parentContainer={this.data}
                        list={this.data.list}
                        onRemove={(list: any[], data: any, parentContainer: any) => {
                          this.removeLayoutData(list, data, parentContainer);
                        }}
                      />
                    )
                  );
                } else {
                  return (
                    item &&
                    item.key && (
                      <WidgetFormItem
                        key={item.key}
                        allConfig={this.data}
                        data={item}
                        select={this.select}
                        onSelect={(data: any) => {
                          this.updateSelect(data);
                        }}
                        list={this.data.list}
                        parentContainer={this.data}
                        onRemove={(list: any[], data: any, parentContainer: any) => {
                          this.removeLayoutData(list, data, parentContainer);
                        }}
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
