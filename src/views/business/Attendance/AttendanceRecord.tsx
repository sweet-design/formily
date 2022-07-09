import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceRecord extends Vue {
  render() {
    return (
      <div class="attendance-record-wrapper">
        <span>考勤记录</span>
      </div>
    );
  }
}
