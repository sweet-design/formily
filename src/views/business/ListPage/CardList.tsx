import { Vue, Component } from 'vue-property-decorator';
import Generator from '@/components/container/FormDesigner/Generator/GenerateForm';
import UserSelector from '@/components/container/Selector/UserSelector';
import DropDownList from '@/components/container/Selector/DropDownList';
import widgetData from '@/views/TempFile/config.json';

@Component
export default class CardList extends Vue {
  private widgetData = widgetData; // 所有配置
  private type = false;
  private widgetModels = {
    input: '张三',
    textarea: '我是来玩的',
    number: 7,
    radio: '',
    checkbox: ['Option1'],
    time: '13:29:08',
    date: '2021-04-26',
    treeSelect: ['3'],
    select: ['Option1'],
    treeSelectText: ['张三'],
    ddList: [
      {
        id: '488020950',
        name: '张三妹',
      },
    ],
    customSelector1: [{ label: '张三', key: '488020950' }],
    switch: true,
  };

  private remoteFuncs = {
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
              children: [{ id: '1-123213', title: 'cacaca' }],
            },
            { id: '2', title: '子级2' },
            { id: '3', title: '子级3', isLeaf: true },
          ];
        }

        resolve(options);
      }, 0);
    },
  };

  $refs!: {
    generateForm: Generator;
  };

  render() {
    return (
      <div class="card-list-wrapper" style="padding: 20px;">
        <Generator
          data={this.widgetData}
          type={this.type}
          value={this.widgetModels}
          remote={this.remoteFuncs}
          ref="generateForm"
          plugins={{
            UserSelector: UserSelector,
            DropDownList: DropDownList,
          }}
        />

        <a-button
          onClick={() => {
            this.$refs.generateForm.getFormItemInstance('treeSelect').excuteOption();
            return;
            this.type = this.type ? false : true;
            return;
            this.$refs.generateForm
              .getData()
              .then(data => {
                console.log(data);
              })
              .catch(e => {});
          }}
        >
          获取
        </a-button>
      </div>
    );
  }
}
