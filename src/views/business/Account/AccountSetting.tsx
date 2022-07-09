import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AccountSetting extends Vue {
  render() {
    return (
      <div class="account-setting-wrapper">
        <span>个人设置</span>
      </div>
    );
  }
}
