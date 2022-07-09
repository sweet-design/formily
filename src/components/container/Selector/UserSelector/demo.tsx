import { Vue, Component } from 'vue-property-decorator';
import UserSelector from '@/components/container/Selector/UserSelector';

@Component
export default class Demo extends Vue {
  private visible = false;

  render() {
    return (
      <UserSelector
        visible={this.visible}
        on={{
          ['update:visible']: (value: boolean) => {
            this.visible = value;
          },
          close: (data: any) => {
            console.log(data);
          },
        }}
      />
    );
  }
}
