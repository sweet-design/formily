import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceChart extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤图表</span>
      </div>
    );
  }
}
