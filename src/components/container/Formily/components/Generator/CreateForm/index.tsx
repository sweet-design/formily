import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { loadCssCode } from '../../../utils';
import actionGenerator from '../../../utils/actionGenerator';
import apiGenerator from '../../../utils/apiGenerator';
import CreateFormItem from '../CreateFormItem';
import './index.less';

@Component
export default class CreateForm extends Vue {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  /**
   * 表单初始化绑定数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: Record<string, any>;

  // 缓存表单配置数据
  get formConfig() {
    return this.config.config;
  }

  // 缓存表单布局相关信息
  get formLayout() {
    if (this.formConfig.layout === 'horizontal') {
      return {
        labelCol: { span: this.formConfig.labelCol },
        wrapperCol: { span: this.formConfig.wrapperCol },
      };
    }

    return {};
  }

  @Watch('value', { deep: true })
  private handleValue(newVal: any, oldValue: any) {
    this.handleValueChange(newVal);
  }

  /**
   * 模型改变回调
   * @param value 回调数据
   */
  @Emit('change')
  private handleValueChange(value: Record<string, any>) {}

  // 动作响应中心生成数据
  private actions = actionGenerator(this.formConfig.actions);
  // 生命周期生成数据
  private lifecycles = actionGenerator(this.formConfig.lifecycles);
  // api生成数据
  private apis = apiGenerator(this.formConfig.apis);

  created() {
    this.initialConfig();

    try {
      this.lifecycles.created({ model: {}, dayjs });
    } catch (e) {
      this.$message.error((e as any).message);
    }
  }

  mounted() {
    try {
      this.lifecycles.mounted({ model: {}, dayjs });
    } catch (e) {
      this.$message.error((e as any).message);
    }
  }

  /**
   * 初始化表单所需配置信息
   */
  private initialConfig() {
    this.generationCss();
  }

  /**
   * 生成自定义css代码
   */
  private generationCss() {
    const styleDom = document.getElementById(`${this.config.key}`);
    if (styleDom) styleDom.remove();
    loadCssCode(this.formConfig.customStyle, this.config.key);
  }

  // 组件同步方式加载器
  private componentLoader(prefix: string, type: string): any {
    return require(`../${prefix}/${type}`).default;
  }

  render() {
    const formConfig = this.formConfig;

    return (
      <div class="formily-create-form">
        <a-form-model
          props={{ model: this.value }}
          labelCol={this.formLayout.labelCol}
          wrapperCol={this.formLayout.wrapperCol}
          labelAlign={formConfig.labelAlign}
          style={formConfig.style}
          class={classnames(formConfig.customClass)}
          ref={this.config.key}
        >
          {this.config.list.map((item: any) => {
            // 输入组件
            if (item.fieldProperties.cate === 'input') {
              return (
                <CreateFormItem
                  config={this.config}
                  currentConfig={item}
                  apis={this.apis}
                  actions={this.actions}
                  form={this.$refs[this.config.key]}
                  models={this.value}
                  directModels={this.value}
                  key={item.key}
                />
              );
            }

            // 布局组件
            if (item.fieldProperties.cate === 'layout') {
              const LayoutComponent = this.componentLoader(
                'LayoutComponents',
                item.fieldProperties.type,
              );
              return (
                <LayoutComponent
                  models={this.value}
                  directModels={this.value}
                  form={this.$refs[this.config.key]}
                  actions={this.actions}
                  config={this.config}
                  currentConfig={item}
                  apis={this.apis}
                  key={item.key}
                />
              );
            }

            // 自增组件
            if (item.fieldProperties.cate === 'array') {
              const ArrayComponent = this.componentLoader(
                'ArrayComponents',
                item.fieldProperties.type,
              );
              return (
                <ArrayComponent
                  models={this.value}
                  directModels={this.value}
                  form={this.$refs[this.config.key]}
                  actions={this.actions}
                  config={this.config}
                  currentConfig={item}
                  apis={this.apis}
                  key={item.key}
                />
              );
            }
          })}
        </a-form-model>
      </div>
    );
  }
}
