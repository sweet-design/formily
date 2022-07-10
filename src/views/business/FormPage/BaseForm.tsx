import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BaseForm extends Vue {
  render() {
    return (
      <div class="base-form-wrapper">
        <span>基本表单页面</span>
      </div>
    );
  }
}
