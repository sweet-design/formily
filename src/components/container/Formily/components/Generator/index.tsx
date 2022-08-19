import { Vue, Component, Prop } from 'vue-property-decorator';
import CreateForm from './CreateForm';
import './index.less';

@Component
export default class Generator extends Vue {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  /**
   * 表单数据初始数据实体
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: any;

  created() {}

  render() {
    return (
      <div class="formily-generator">
        <CreateForm config={this.config} />
      </div>
    );
  }
}
