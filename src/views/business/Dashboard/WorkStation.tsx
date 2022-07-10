import { Vue, Component } from 'vue-property-decorator';
import { GenerateForm } from '@/components/container/FormDesigner';
import widgetData from '@/assets/json/demo.json';

@Component
export default class WorkStation extends Vue {
  private handleDataChange(data: Record<string, any>, value: any, key: string) {
    // console.log(value, key, data);
  }

  private widgetModels: any = {}; // 预览时默认给表单的实体数据

  private remoteFuncs = {
    lebrons(resolve: Function) {
      setTimeout(() => {
        const dom = '<div>12小时</div>';
        resolve(dom);
      }, 1000);
    },
    updateDays(obj: any) {
      obj.desc = '<div>我是算出来的结果</div>';
    },
  };

  render() {
    return (
      <div class="work-station-wrapper">
        <GenerateForm
          onChange={this.handleDataChange}
          data={widgetData}
          value={this.widgetModels}
          ref="generateForm"
          remote={this.remoteFuncs}
        ></GenerateForm>
      </div>
    );
  }
}
