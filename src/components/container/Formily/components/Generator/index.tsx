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

  render() {
    return (
      <div class="formily-generator">
        <CreateForm
          config={this.config}
          value={this.value}
          onChange={(data: any) => {
            this.handleValueChange(data);
          }}
        />
      </div>
    );
  }
}
