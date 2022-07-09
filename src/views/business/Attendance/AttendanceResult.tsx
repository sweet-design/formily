import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceResult extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤结果</span>
      </div>
    );
  }
}
