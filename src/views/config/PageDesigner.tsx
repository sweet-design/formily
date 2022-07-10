import { Vue, Component } from 'vue-property-decorator';
import { FormDesigner } from '@/components/container/FormDesigner';
// import { FormDesigner } from 'cui-page-designer';
import '@/assets/less/config/PageDesigner.less';
import DropDownList from '@/components/container/Selector/DropDownList';
import UserSelector from '@/components/container/Selector/UserSelector';
import Upload from '@/components/container/Upload';
import { getDictData } from '@/apis/business';

@Component
export default class PageDesigner extends Vue {
  private remoteFuncs = {
    func_test(resolve: Function) {
      setTimeout(() => {
        const options = [
          { id: '1', name: '1111' },
          { id: '2', name: '2222' },
          { id: '3', name: '3333' },
        ];

        resolve(options);
      }, 2000);
    },
    lebrons(resolve: Function) {
      setTimeout(() => {
        const dom = '<div>12小时</div>';
        resolve(dom);
      }, 1000);
    },
    updateDays(obj: any) {
      obj.desc = '<div>我是算出来的结果</div>';
    },
    /**
     * 动态加载树形数据
     * @param resolve 回调函数
     * @param params 远端方法参数
     */
    loadTree(resolve: Function, params?: any) {
      let options: any[] = [];
      setTimeout(() => {
        if (params) {
          if (params.dataRef.id == '1') {
            options = [
              { id: '1-1', title: '子级1-1' },
              { id: '1-2', title: '子级1-2' },
              { id: '1-3', title: '子级1-3' },
            ];
          } else if (params.dataRef.id == '2') {
            options = [
              { id: '2-1', title: '子级2-1' },
              { id: '2-2', title: '子级2-2' },
              { id: '2-3', title: '子级2-3' },
            ];
          }
        } else {
          options = [
            {
              id: '1',
              title: '子级1',
              children: [{ id: '1-123213', title: 'heihei' }],
            },
            { id: '2', title: '子级2' },
            { id: '3', title: '子级3', isLeaf: true },
          ];
        }

        resolve(options);
      }, 2000);
    },
    funcGetToken(resolve: Function) {
      // request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
      // 	resolve(res.uptoken);
      // });
    },
    upload_callback(response: any, file: any, fileList: any) {
      console.log('callback', response, file, fileList);
    },
    getDictData: async (resolve: Function) => {
      const res = await getDictData({ name: '湛山' });
      resolve(res.data);
    },
    handleClickBtn: () => {
      alert('我是按钮组哦');
    },
    getTableColDict: (resolve: Function) => {
      resolve([
        { uid: '123', label: '张三' },
        { uid: '456', label: '李四' },
        { uid: '789', label: '王五' },
      ]);
    },
  };

  render() {
    return (
      <div class="page-designer-wrapper">
        <FormDesigner
          basicFields={[
            'input',
            'textarea',
            'number',
            'radio',
            'checkbox',
            'time',
            'date',
            'select',
            'ddList',
            'treeSelect',
            'customSelector',
            'switch',
            'button',
            'html',
            'text',
          ]}
          advanceFields={['table', 'imgupload', 'cascader']}
          plugins={{
            DropDownList: DropDownList,
            UserSelector: UserSelector,
            Upload: Upload,
          }}
          upload
          preview
          clearable
          generateJson
          remoteFuncs={this.remoteFuncs}
        />
      </div>
    );
  }
}
