import { Vue, Component } from 'vue-property-decorator';
import { FormDesigner } from '@/components/container/Formily';

@Component
export default class PageDesigner extends Vue {
  render() {
    return <FormDesigner />;
  }
}
