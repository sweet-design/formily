import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceModify extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤修改</span>
      </div>
    );
  }
}
