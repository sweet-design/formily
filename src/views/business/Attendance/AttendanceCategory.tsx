import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceCategory extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤类别</span>
      </div>
    );
  }
}
