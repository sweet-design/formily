import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceCenter extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤中心</span>
      </div>
    );
  }
}
