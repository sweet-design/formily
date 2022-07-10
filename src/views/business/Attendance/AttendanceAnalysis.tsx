import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceAnalysis extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤分析</span>
      </div>
    );
  }
}
