import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceList extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤列表</span>
      </div>
    );
  }
}
