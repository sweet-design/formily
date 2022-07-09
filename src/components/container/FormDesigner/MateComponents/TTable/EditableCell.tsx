import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import './EditableCell.less';

@Component
export default class Test extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  text!: string;

  private value = this.text;
  private editable = false;

  handleChange(e: any) {
    const value = e.target.value;
    this.value = value;
  }

  @Emit('change')
  protected changeEmit(value: string) {}

  check() {
    this.editable = false;
    this.changeEmit(this.value);
  }

  edit() {
    this.editable = true;
  }

  render() {
    return (
      <div class="editable-cell">
        {this.editable ? (
          <div class="editable-cell-input-wrapper">
            <a-input value={this.value} onChange={this.handleChange} onPressEnter={this.check} />
            <a-icon type="check" class="editable-cell-icon-check" onClick={this.check} />
          </div>
        ) : (
          <div class="editable-cell-text-wrapper">
            {this.value || ' '}
            <a-icon type="edit" class="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
