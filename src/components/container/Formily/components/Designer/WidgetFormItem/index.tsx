import { Component, Prop, Vue, Emit, Mixins } from 'vue-property-decorator';
import classnames from 'classnames';
import { createHash } from '../../../utils/format';
import './index.less';
import mixin from '../../../utils/mixin';

@Component
export default class WidgetFormItem extends Mixins(mixin) {
  /**
   * 单个字段配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
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
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  /**
   * 跟新当前选中的输入组件
   * @param value 当前点击的栅格布局组件配置数据
   */
  @Emit('select')
  private componentSelectChangeHandle(value: any) {}

  /**
   * 删除栅格组件
   * @param value 当前所要删除的栅格组件的配置数据
   */
  @Emit('remove')
  private componentRemoveHandle(value: any, parentContainer: any) {
    return this.list;
  }

  /**
   * 复制组件
   * @param data 复制的数据对象
   */
  private handleWidgetClone(data: any) {
    const curIndex = this.list.findIndex((item: any) => item.key === data.key);
    let cloneData = {
      ...data,
      key: createHash(12),
    };

    cloneData = JSON.parse(JSON.stringify(cloneData));

    this.list.splice(curIndex, 0, cloneData);

    this.$nextTick(() => {
      this.componentSelectChangeHandle(this.list[curIndex + 1]);
    });
  }

  // 动态导入输入组件
  private InputComponent: any = () =>
    import(`../InputComponents/${this.data.fieldProperties.type}`);

  // 缓存容器属性
  get decoratorProperties() {
    return this.data.decoratorProperties;
  }

  // 缓存组件属性
  get componentProperties() {
    return this.data.componentProperties;
  }

  // 缓存字段属性
  get fieldProperties() {
    return this.data.fieldProperties;
  }

  // 缓存表单配置信息
  get formConfig() {
    return this.allConfig.config;
  }

  // 计算标签宽度
  get labelWidth() {
    if (this.decoratorProperties.labelWidth !== 'auto') {
      return this.decoratorProperties.labelWidth;
    }

    if (this.formConfig.labelWidth !== 'auto') {
      return this.formConfig.labelWidth;
    }

    return '';
  }

  // 计算控件宽度
  get wrapperWidth() {
    if (this.decoratorProperties.wrapperWidth !== 'auto') {
      return this.decoratorProperties.wrapperWidth;
    }

    if (this.formConfig.wrapperWidth !== 'auto') {
      return this.formConfig.wrapperWidth;
    }

    return '';
  }

  // 计算组件对齐方式
  get wrapperAlign() {
    if (this.decoratorProperties.wrapperAlign) {
      return this.decoratorProperties.wrapperAlign === 'left' ? 'flex-start' : 'flex-end';
    }

    if (this.formConfig.wrapperAlign) {
      return this.formConfig.wrapperAlign === 'left' ? 'flex-start' : 'flex-end';
    }
  }

  render() {
    return (
      <div class="widget-form-item">
        <div
          class={classnames('widget-form-item__item', {
            active: this.select.key == this.data.key,
          })}
          onClick={(e: Event) => {
            e.stopPropagation();
            this.componentSelectChangeHandle(this.data);
          }}
        >
          <a-form-item
            style={{
              opacity: this.fieldProperties.display === 'visible' ? '100%' : '0',
            }}
            required={this.fieldProperties.required}
            class={classnames([
              ...this.decoratorProperties.customClass,
              this.componentProperties.size ?? this.formConfig.size,
            ])}
            props={
              this.formConfig.layout === 'horizontal'
                ? {
                    labelCol: {
                      span: this.decoratorProperties.labelCol ?? this.formConfig.labelCol,
                    },
                    wrapperCol: {
                      span: this.decoratorProperties.wrapperCol ?? this.formConfig.wrapperCol,
                    },
                  }
                : null
            }
            colon={this.decoratorProperties.colon}
            labelAlign={this.decoratorProperties.labelAlign ?? this.formConfig.labelAlign}
            extra={this.getLangResult(
              this.fieldProperties.descriptionLangKey,
              this.fieldProperties.description,
            )}
            scopedSlots={{
              label: () => {
                return this.decoratorProperties.hideLabel ? null : (
                  <span
                    style={{
                      display: 'inline-block',
                      width: this.labelWidth,
                      maxWidth: this.labelWidth,
                    }}
                  >
                    {this.getLangResult(
                      this.fieldProperties.titleLangKey,
                      this.fieldProperties.title,
                    )}
                    {this.getLangResult(
                      this.decoratorProperties.tooltipLangKey,
                      this.decoratorProperties.tooltip,
                    ) !== '' && (
                      <a-tooltip
                        title={this.getLangResult(
                          this.decoratorProperties.tooltipLangKey,
                          this.decoratorProperties.tooltip,
                        )}
                      >
                        <a-icon
                          type="info-circle"
                          style="color: rgba(0,0,0,.45); position: relative; top: 1px; margin-left: 4px"
                        />
                      </a-tooltip>
                    )}
                  </span>
                );
              },
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: this.wrapperAlign,
              }}
            >
              {
                <this.InputComponent
                  config={this.data}
                  allConfig={this.allConfig}
                  style={this.wrapperWidth !== '' && { width: this.wrapperWidth }}
                />
              }
            </div>
          </a-form-item>
        </div>

        {this.select.key == this.data.key && [
          <div class="widget-form-item__item-action" style="top: 0; right: 56px;">
            <a-tooltip title="删除组件">
              <a-icon
                type="delete"
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.componentRemoveHandle(this.data, this.parentContainer);
                }}
              />
            </a-tooltip>
          </div>,
          <div class="widget-form-item__item-action" style="top: 0; right: 28px;">
            <a-tooltip title="复制组件">
              <a-icon
                type="copy"
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.handleWidgetClone(this.data);
                }}
              />
            </a-tooltip>
          </div>,
          <div class="widget-form-item__item-drag" style="top: 0; cursor: move;">
            <a-tooltip title="拖拽排序">
              <a-icon type="drag" class="drag-widget" />
            </a-tooltip>
          </div>,
        ]}
      </div>
    );
  }
}
