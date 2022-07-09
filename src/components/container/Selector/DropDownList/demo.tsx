import { Vue, Component } from 'vue-property-decorator';
import DropDownList from '@/components/container/Selector/DropDownList';

@Component
export default class Demo extends Vue {
  render() {
    return (
      <DropDownList
        value={[{ name: '张三', id: '123' }]}
        multiple={false}
        onChange={(data: any) => {
          console.log(data);
        }}
      />
    );
  }
}
