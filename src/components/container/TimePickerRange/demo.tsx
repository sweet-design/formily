import { Vue, Component } from 'vue-property-decorator';
import TimePickerRange from '@/components/container/TimePickerRange';

@Component
export default class Demo extends Vue {
  private timeRange = [];

  render() {
    return (
      <TimePickerRange
        vModel={this.timeRange}
        format="HH:mm"
        minuteStep={15}
        placeholder={['开始时间', '结束时间']}
      />
    );
  }
}
