import { Vue, Component } from 'vue-property-decorator';

@Component
export default class UserInfoReport extends Vue {
  render() {
    return (
      <div class="user-info-report-wrapper">
        <span>人员信息报表</span>
      </div>
    );
  }
}
