import { Component, Prop, Mixins } from 'vue-property-decorator';
import classnames from 'classnames';
import mixin from '../../../../utils/mixin';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';
import rulesGenerator from '../../../../utils/rulesGenerator';
import Recognizer from './recognizer';
import './index.less';

@Component
export default class ArrayTable extends Mixins(mixin) {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  /**
   * 当前控件配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  currentConfig!: any;

  /**
   * 动作响应池数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  actions!: any;

  /**
   * api接口数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  apis!: any;

  /**
   * 表单实例对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  form!: any;

  /**
   * 表单数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  models!: any;

  /**
   * 直属上层数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  directModels!: any;

  /**
   * 字段路径
   */
  @Prop({
    type: String,
    default: '',
  })
  path!: string;

  // 动态导入输入组件
  private InputComponent: any = () =>
    import(`../${this.componentCate}/${this.currentConfig.fieldProperties.type}`);

  // 缓存组件类别，动态加载指定类别下的组件
  get componentCate() {
    switch (this.currentConfig.fieldProperties.cate) {
      case 'array':
        return 'ArrayComponents';
      case 'input':
        return 'InputComponents';
      case 'layout':
        return 'LayoutComponents';
    }
  }

  // 缓存容器属性
  get decoratorProperties() {
    return this.currentConfig.decoratorProperties;
  }

  // 缓存组件属性
  get componentProperties() {
    return this.currentConfig.componentProperties;
  }

  // 缓存字段属性
  get fieldProperties() {
    return this.currentConfig.fieldProperties;
  }

  // 缓存表单配置信息
  get formConfig() {
    return this.config.config;
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

  // 缓存表单项布局相关信息
  get formItemLayout() {
    if (this.formConfig.layout === 'horizontal') {
      return {
        labelCol: { span: this.decoratorProperties.labelCol ?? this.formConfig.labelCol },
        wrapperCol: { span: this.decoratorProperties.wrapperCol ?? this.formConfig.wrapperCol },
      };
    }

    return {};
  }

  render() {
    return (
      <div class="formily-array-table">
        <a-form-model-item
          style={{
            opacity: this.fieldProperties.display === 'visible' ? '100%' : '0',
          }}
          class={classnames([
            ...this.decoratorProperties.customClass,
            this.componentProperties.size ?? this.formConfig.size,
          ])}
          labelCol={this.formItemLayout.labelCol}
          wrapperCol={this.formItemLayout.wrapperCol}
          colon={this.decoratorProperties.colon}
          labelAlign={this.decoratorProperties.labelAlign ?? this.formConfig.labelAlign}
          extra={this.getLangResult(
            this.fieldProperties.descriptionLangKey,
            this.fieldProperties.description,
          )}
          scopedSlots={{
            label: () => {
              return this.decoratorProperties.hideLabel ? null : (
                <a-tooltip
                  title={this.getLangResult(
                    this.fieldProperties.titleLangKey,
                    this.fieldProperties.title,
                  )}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: this.labelWidth,
                      maxWidth: this.labelWidth,
                    }}
                    class={classnames({
                      'formily-array-table__space':
                        !this.decoratorProperties.colon && !this.decoratorProperties.hideLabel,
                    })}
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
                </a-tooltip>
              );
            },
          }}
          prop={`${this.path}${this.currentConfig.fieldProperties.name}`}
          rules={rulesGenerator(this.currentConfig, this.getLangResult)}
          ref={this.currentConfig.key}
          autoLink={false}
        >
          <div
            style={{
              textAlign: this.decoratorProperties.wrapperAlign ?? this.formConfig.wrapperAlign,
            }}
          >
            <Recognizer
              config={this.config}
              currentConfig={this.currentConfig}
              actions={this.actions}
              style={this.wrapperWidth !== '' && { width: this.wrapperWidth }}
              models={this.models}
              apis={this.apis}
              form={this.form}
              directModels={this.models}
              formItemInstance={this.$refs[this.currentConfig.key]}
            />
          </div>
        </a-form-model-item>
      </div>
    );
  }
}
