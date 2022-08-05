import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class SwitchType extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  value!: string;

  @Emit('change')
  protected updateValue(val: string) {}

  private index = 0;
  private defaultValue = [
    { unit: 'px', value: 0 },
    { unit: '%', value: 0 },
    { unit: 'vh', value: 0 },
    { unit: 'em', value: 0 },
  ];

  private transformFun() {
    const obj = this.defaultValue[this.index];
    return `${obj.value}${obj.unit}`;
  }

  created() {
    if (this.value !== 'auto') {
      this.index = this.defaultValue.findIndex(item => this.value.indexOf(item.unit) != -1);
      this.defaultValue[this.index].value = parseInt(
        this.value.replace(this.defaultValue[this.index].unit, ''),
      );
    }
  }

  render() {
    return (
      <div>
        <a-row type="flex" v-show={this.value === 'auto'}>
          <a-col span="24">
            <a-button
              style="width: 100%; float: right"
              onClick={() => {
                this.index = 0;
                this.updateValue(`${this.defaultValue[0].value}${this.defaultValue[0].unit}`);
              }}
            >
              auto
            </a-button>
          </a-col>
        </a-row>
        <a-row gutter={5} v-show={this.value !== 'auto'}>
          <a-col span="18">
            <a-input-number
              style="width: 100%; float: right;"
              vModel={this.defaultValue[this.index].value}
              onChange={() => {
                this.updateValue(this.transformFun());
              }}
            />
          </a-col>
          <a-col span="6">
            <a-button
              style="width: 100%; padding: 0; float: right;"
              onClick={() => {
                if (this.index == 3) {
                  this.updateValue('auto');
                } else {
                  this.index++;
                  this.updateValue(this.transformFun());
                }
              }}
            >
              {this.defaultValue[this.index].unit}
            </a-button>
          </a-col>
        </a-row>
      </div>
    );
  }
}
