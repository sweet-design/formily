import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SchedulingList extends Vue {
  render() {
    return (
      <div class="scheduling-list-wrapper">
        <span>排班列表：</span>
      </div>
    );
  }
}
