import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator';
import CreateForm from './CreateForm';
import './index.less';

@Component
export default class Generator extends Vue {
  @Model('change', { type: Object, default: () => ({}) }) value!: Record<string, any>;

  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  created() {}

  /**
   * 模型改变回调
   * @param value 回调数据
   */
  @Emit('change')
  private handleValueChange(value: Record<string, any>) {}

  /**
   * 获取表单数据并校验
   * @returns 数据模型
   */
  public getData() {
    return new Promise((resolve, reject) => {
      (this.$refs[this.config.key] as any).$children[0].validate((valid: boolean, data: any) => {
        if (valid) {
          resolve(this.value);
        } else {
          reject(data);
        }
      });
    });
  }

  /**
   * 重置表单数据
   */
  public reset() {
    (this.$refs[this.config.key] as any).$children[0].resetFields();
  }

  /**
   * 移除表单项的校验结果
   */
  public clear(props?: Array<string> | string) {
    const ref = (this.$refs[this.config.key] as any).$children[0];
    props ? ref.clearValidate(props) : ref.clearValidate();
  }

  render() {
    return (
      <div class="formily-generator">
        <CreateForm
          config={this.config}
          value={this.value}
          ref={this.config.key}
          onChange={(data: any) => {
            this.handleValueChange(data);
          }}
        />
      </div>
    );
  }
}
