import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AccountCenter extends Vue {
  render() {
    return (
      <div class="account-center-wrapper">
        <span>个人中心页面</span>
      </div>
    );
  }
}
