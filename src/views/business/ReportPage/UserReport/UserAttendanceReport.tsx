import { Vue, Component } from 'vue-property-decorator';

@Component
export default class UserAttendanceReport extends Vue {
  render() {
    return (
      <div class="user-attendance-report-wrapper">
        <span>人员出勤报表</span>
      </div>
    );
  }
}
