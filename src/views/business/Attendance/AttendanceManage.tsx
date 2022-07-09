import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceManage extends Vue {
  render() {
    return (
      <div class="attendance-manage-wrapper">
        <span>考勤管理</span>
      </div>
    );
  }
}
