import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SeniorForm extends Vue {
  render() {
    return (
      <div class="senior-form-wrapper">
        <span>高级表单页面</span>
      </div>
    );
  }
}
