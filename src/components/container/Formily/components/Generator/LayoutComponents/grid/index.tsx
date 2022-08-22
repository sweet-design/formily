import { Vue, Component, Prop } from 'vue-property-decorator';
import CreateFormItem from '../../CreateFormItem';

@Component
export default class Grid extends Vue {
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
   * 表单数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  models!: any;

  /**
   * 表单实例对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  form!: any;

  /**
   * 直属上层数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  directModels!: any;

  render() {
    const fieldProperties = this.currentConfig.fieldProperties;
    const componentProperties = this.currentConfig.componentProperties;

    return (
      <div class="formily-layout-grid">
        <a-row
          type="flex"
          gutter={componentProperties.gutter}
          justify={componentProperties.justify}
          align={componentProperties.align}
        >
          {componentProperties.columns.map((col: any, colIndex: number) => {
            return (
              <a-col
                key={colIndex}
                span={col.span}
                style={{
                  opacity: fieldProperties.display === 'visible' ? '100%' : '0',
                }}
              >
                {col.list.map((item: any) => {
                  return (
                    <CreateFormItem
                      actions={this.actions}
                      config={this.config}
                      models={this.models}
                      form={this.form}
                      apis={this.apis}
                      currentConfig={item}
                      directModels={this.directModels}
                      key={item.key}
                    />
                  );
                })}
              </a-col>
            );
          })}
        </a-row>
      </div>
    );
  }
}
