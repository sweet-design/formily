import { Vue, Component, Prop } from 'vue-property-decorator';
import './WidgetConfig.less';

@Component
export default class FormConfig extends Vue {
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  render() {
    return (
      <div class="widget-config-wrapper">
        <a-form-model label-col={{ span: 0 }} wrapper-col={{ span: 24 }}>
          {this.data.type !== 'grid' && [
            <a-divider>标签对齐方式</a-divider>,
            <a-form-model-item>
              <div class="feild-item">
                <a-radio-group vModel={this.data.labelAlign} buttonStyle="solid">
                  <a-radio-button value="left">左</a-radio-button>
                  <a-radio-button value="right">右</a-radio-button>
                </a-radio-group>
              </div>
            </a-form-model-item>,
            <a-divider>标签栅格宽度</a-divider>,
            <a-form-model-item>
              <div class="feild-item">
                <a-input-number
                  style="width: 100%;"
                  vModel={this.data.labelCol}
                  min={0}
                  max={24}
                  onChange={() => {}}
                />
              </div>
            </a-form-model-item>,
            <a-divider>组件尺寸</a-divider>,
            <a-form-model-item>
              <div class="feild-item">
                <a-radio-group vModel={this.data.size} buttonStyle="solid">
                  <a-radio-button value="large">大</a-radio-button>
                  <a-radio-button value="default">默认</a-radio-button>
                  <a-radio-button value="small">小</a-radio-button>
                </a-radio-group>
              </div>
            </a-form-model-item>,
          ]}
        </a-form-model>
      </div>
    );
  }
}
