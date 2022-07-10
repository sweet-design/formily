import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceCalculation extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤计算</span>
      </div>
    );
  }
}
