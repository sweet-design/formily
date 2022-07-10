import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SchedulingManage extends Vue {
  render() {
    return (
      <div class="scheduling-manage-wrapper">
        <span>排班管理</span>
      </div>
    );
  }
}
