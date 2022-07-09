import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AttendanceGenerate extends Vue {
  render() {
    return (
      <div class="attendance-list-wrapper">
        <span>考勤生成</span>
      </div>
    );
  }
}
