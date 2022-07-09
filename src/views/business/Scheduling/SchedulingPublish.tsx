import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SchedulingPublish extends Vue {
  render() {
    return (
      <div class="scheduling-publish-wrapper">
        <span>排班发布</span>
      </div>
    );
  }
}
