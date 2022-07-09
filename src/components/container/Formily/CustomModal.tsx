import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';

@Component
export default class CustomModal extends Vue {
  /**
   * 是否显示弹出框
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  @Prop({
    type: String,
    default: '',
  })
  loadingText!: string;

  /**
   * 弹出框标题
   */
  @Prop({
    type: String,
    default: '',
  })
  title!: string;

  /**
   * 弹出框宽度
   */
  @Prop({
    type: [String, Number],
    default: '600px',
  })
  width!: string | number;

  @Prop({
    type: Boolean,
    default: false,
  })
  form!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  action!: boolean;

  get show() {
    if (this.form) {
      return this.showForm;
    } else {
      return true;
    }
  }

  private showForm = false;
  private dialogVisible = this.visible; // 初始化时赋值
  private id = 'dialog_' + new Date().getTime();
  private loading = false;

  @Emit('close')
  private emitClose() {}

  @Emit('submit')
  private emitSubmit() {}

  @Watch('dialogVisible')
  protected dialogVisibleChange(newVal: boolean) {
    if (!newVal) {
      this.loading = false;
      this.emitClose();
      setTimeout(() => {
        this.showForm = false;
      }, 300);
    } else {
      this.showForm = true;
    }
  }

  @Watch('visible')
  protected visibleChange(newVal: boolean) {
    this.dialogVisible = newVal;
  }

  public end() {
    this.loading = false;
  }

  render() {
    return (
      <div class="custom-modal-wrapper">
        <a-modal
          id={this.id}
          vModel={this.dialogVisible}
          title={this.title}
          centered
          keyboard={false}
          maskClosable={false}
          confirmLoading={this.loading}
          width={this.width}
          onOk={() => {
            this.loading = true;
            this.emitSubmit();
          }}
          onCancel={() => {
            this.emitClose();
          }}
          scopedSlots={{
            footer: () => {
              return this.$slots.action;
            },
          }}
        >
          {this.show && <div>{this.$slots.default}</div>}
        </a-modal>
      </div>
    );
  }
}
