import { Vue, Component } from 'vue-property-decorator';
import { FormDesigner } from '@/components/container/Formily';

@Component
export default class PageDesigner extends Vue {
  private config: any = {
    list: [],
    config: {
      labelCol: 6,
      wrapperCol: 18,
      labelWidth: 'auto',
      wrapperWidth: 'auto',
      labelAlign: 'right',
      wrapperAlign: 'left',
      layout: 'horizontal',
      size: 'default',
      style: {
        width: 'auto',
        height: 'auto',
      },
      renderEngine: 'vue2',
      renderUI: 'ant-design-vue',
      customClass: [],
      customStyle: '',
      clientEnv: 'pc',
      actions: [],
      apis: [],
      lifecycles: [
        {
          key: 'created',
          name: 'created',
          body: '',
        },
        {
          key: 'mounted',
          name: 'mounted',
          body: '',
        },
        {
          key: 'changed',
          name: 'changed',
          body: '',
        },
        {
          key: 'reseted',
          name: 'reseted',
          body: '',
        },
      ],
    },
    key: 'gnfqsk0orx7y',
  };

  created() {}

  render() {
    return <FormDesigner config={this.config} />;
  }
}
