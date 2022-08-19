import { Vue, Component, Prop } from 'vue-property-decorator';
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

  // 表单数据模型
  private models = {};

  render() {
    const formConfig = this.formConfig;

    return (
      <div class="formily-create-form">
        <a-form-model
          props={{ model: this.models }}
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
                  models={this.models}
                  directModels={this.models}
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
                  models={this.models}
                  directModels={this.models}
                  form={this.$refs[this.config.key]}
                  actions={this.actions}
                  config={this.config}
                  currentConfig={item}
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
                  models={this.models}
                  directModels={this.models}
                  form={this.$refs[this.config.key]}
                  actions={this.actions}
                  config={this.config}
                  currentConfig={item}
                  key={item.key}
                />
              );
            }
          })}

          <a-form-model-item>
            <a-button
              type="primary"
              html-type="submit"
              onClick={(e: any) => {
                e.preventDefault();
                console.log('最终数据', this.models);

                (this.$refs[this.config.key] as any).validate((valid: any, data: any) => {
                  if (valid) {
                    console.log('验证通过', data);
                  } else {
                    console.log('验证错误字段', data);
                    return false;
                  }
                });
              }}
            >
              Submit
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    );
  }
}
