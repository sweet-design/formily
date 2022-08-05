import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import './index.less';

@Component
export default class PropertyConfig extends Vue {
  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  /**
   * 当前选中的组件配置数据模型
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  // 组件类型改变需要更新配置组件
  @Watch('select.fieldProperties.type')
  private componentTypeChangeHandle(newVal: string) {
    this.updateComponent(newVal);
  }

  // 当选选中的组件改变时，需要更新折叠面板的展开状态，方便查看
  @Watch('select')
  private selectChangeHanle() {
    this.collapseList = ['field', 'component'];
  }

  private updateComponent(type: string) {
    this.FieldPropertyConfig = () => import(`./FieldPropertyConfig/${type}`);
    this.ComponentPropertyConfig = () => import(`./ComponentPropertyConfig/${type}`);
    this.DecoratorPropertyConfig = () => import(`./DecoratorPropertyConfig/${type}`);
  }

  // 计算是否能显示右侧属性配置窗口，如果当前选择的是整个表单，将不能显示属性配置窗口
  get show() {
    if (this.select && !this.select.config && Object.keys(this.select).length > 0) {
      return true;
    }

    return false;
  }

  // 当前展开的折叠面板标识列表
  private collapseList = ['field', 'component'];

  // 根据组件类型，动态加载指定的字段属性配置组件
  private FieldPropertyConfig: any = null;
  // 根据组件类型，动态加载指定的组件属性配置组件
  private ComponentPropertyConfig: any = null;
  // 根据组件类型，动态加载指定的容器属性配置组件
  private DecoratorPropertyConfig: any = null;

  render() {
    // 容器属性
    const decoratorProperties = this.show && this.select.decoratorProperties;
    const componentProperties = this.show && this.select.componentProperties;

    return (
      <div class="property-config-wrapper">
        {this.show && (
          <a-collapse
            vModel={this.collapseList}
            scopedSlots={{
              expandIcon: (props: any) => {
                return <a-icon type="caret-right" rotate={props.isActive ? 90 : 0} />;
              },
            }}
          >
            <a-collapse-panel key="field" header="字段属性">
              <this.FieldPropertyConfig select={this.select} data={this.data} />
            </a-collapse-panel>

            {componentProperties && (
              <a-collapse-panel key="component" header="组件属性">
                <this.ComponentPropertyConfig select={this.select} data={this.data} />
              </a-collapse-panel>
            )}

            {/* 布局组件是没有容器属性的 */}
            {decoratorProperties && (
              <a-collapse-panel key="decorator" header="容器属性">
                <this.DecoratorPropertyConfig select={this.select} data={this.data} />
              </a-collapse-panel>
            )}
          </a-collapse>
        )}
      </div>
    );
  }
}
