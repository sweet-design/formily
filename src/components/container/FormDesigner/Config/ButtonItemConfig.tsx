import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import './TableConfig.less';

@Component
export default class ButtonItemConfig extends Vue {
  /**
   * 是否显示table的列配置窗口
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 列配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: Record<string, any>;

  @Emit('close')
  protected handleClose(state: boolean) {}

  private configs: any = this.config; // 复制当前配置信息

  @Emit('update:config')
  protected updateSelect(newVal: any) {}

  @Watch('configs', { deep: true })
  private watchConfigs(value: any) {
    this.updateSelect(value);
  }

  render() {
    return (
      <div>
        <a-drawer
          title="按钮项配置"
          placement="right"
          visible={this.visible}
          destroyOnClose={true}
          onClose={() => {
            this.handleClose(false);
          }}
        >
          <a-divider>标题</a-divider>
          <div class="feild-item">
            <a-input style="width: 100%;" vModel={this.configs.title} />
          </div>
          <a-divider>图标</a-divider>
          <div class="feild-item">
            <a-input vModel={this.configs.icon} />
          </div>
          <a-divider>事件方法</a-divider>
          <div class="feild-item">
            <a-input vModel={this.configs.handleEvent} />
          </div>
        </a-drawer>
      </div>
    );
  }
}
