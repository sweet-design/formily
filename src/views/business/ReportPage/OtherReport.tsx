import { Vue, Component } from 'vue-property-decorator';

@Component
export default class OtherReport extends Vue {
  render() {
    return (
      <div class="other-report-wrapper">
        <span>其他报表</span>
      </div>
    );
  }
}
