import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendancePeriod extends Vue {
  render() {
    return (
      <div class="attendance-period-wrapper">
        <span>考勤期数</span>
      </div>
    );
  }
}
