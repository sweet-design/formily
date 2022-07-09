import { Component, Prop, Vue } from 'vue-property-decorator';
import GenerateForm from '@/components/container/FormDesigner/Generator/GenerateForm';
import DropDownList from '@/components/container/Selector/DropDownList';
import UserSelector from '@/components/container/Selector/UserSelector';

@Component
export default class Form extends Vue {
  /**
   * 弹出框标题
   */
  @Prop({
    type: String,
    default: '默认标题',
  })
  title!: string;

  /**
   * 是否显示
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 表单配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  widgetData!: Record<string, any>;

  /**
   * 表单默认值
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: Record<string, any>;

  /**
   * 表单获取数据远端方法，需内置
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: any;

  get showState() {
    return this.visible;
  }

  set showState(value) {
    this.$emit('update:visible', value);
  }

  $refs!: {
    generateForm: GenerateForm;
  };

  /**
   * 数据监听改变回调
   * @param data 整个form表单数据模型
   * @param value 改变的当前新值
   * @param key 当前改变值的key
   */
  private handleDataChange(data: Record<string, any>, value: any, key: string) {
    this.$emit('change', data, value, key);
  }

  render() {
    return (
      <a-drawer
        placement="right"
        visible={this.showState}
        width={800}
        onClose={() => {
          this.showState = false;
        }}
        scopedSlots={{
          title: () => {
            return (
              <>
                <span>{this.title}</span>
                <span
                  style="float: right; margin-right: 28px; font-size: 14px; cursor: pointer;"
                  onClick={() => {
                    this.$refs.generateForm.getData().then(data => {
                      this.$emit('save', data);
                      this.showState = false;
                    });
                  }}
                >
                  <a-icon type="save" style="margin-right: 5px;" />
                  保存
                </span>
              </>
            );
          },
        }}
      >
        <GenerateForm
          ref="generateForm"
          data={this.widgetData}
          value={this.value}
          remote={this.remote}
          plugins={{
            UserSelector: UserSelector,
            DropDownList: DropDownList,
          }}
          onChange={this.handleDataChange}
        />
      </a-drawer>
    );
  }
}
