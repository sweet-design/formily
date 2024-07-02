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
    input: '',
    textarea: '',
    number: 7,
    radio: '',
    checkbox: ['Option1'],
    time: '13:29:08',
    date: '2021-04-26',
    treeSelect: '21',
    treeSelectText: '子级2-1',
    treeSelect2: ['1', '2'],
    treeSelectText2: ['子级孙2-2', '子级孙2-1'],
    select: ['Option1'],
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
    loadTree(resolve: Function, params?: any, value?: string) {
      let options: any[] = [];
      console.log('获取数据', params, value);
      const isdataRef = params ? (params.dataRef ? true : false) : false;
      setTimeout(() => {
        if (value) {
          options = [
            { id: 's1', title: '搜索1', children: [] },
            { id: 's2', title: '搜索2', children: null },
            { id: 's3', title: '搜索3', children: null },
          ];
          options.map(r => {
            if (r.children == null) {
              r.isLeaf = true;
            } else {
              r.isLeaf = false;
            }
          });
          resolve(options);
        } else {
          if (isdataRef) {
            if (params.dataRef.id == '2') {
              options = [
                { id: '21', title: '子级孙2-1', children: [] },
                { id: '22', title: '子级孙2-2', children: null },
                { id: '23', title: '子级孙2-3', children: null },
              ];
            } else if (params.dataRef.id == '21') {
              options = [
                { id: '211', title: '子级孙孙2-1-1', children: null },
                { id: '212', title: '子级孙孙2-1-2', children: [] },
                { id: '213', title: '子级孙孙2-1-3', children: null },
              ];
            } else if (params.dataRef.id == '212') {
              options = [
                { id: '2121', title: '子级孙孙孙2-1-2-1', children: null },
                { id: '2122', title: '子级孙孙孙2-1-2-2', children: null },
                { id: '2123', title: '子级孙孙孙2-1-2-3', children: null },
              ];
            }
            options.map(r => {
              if (r.children == null) {
                r.isLeaf = true;
              } else {
                r.isLeaf = false;
              }
            });
            console.log('懒加载回调', JSON.parse(JSON.stringify(options)));
            resolve(options);
          } else {
            options = [
              {
                id: '0',
                title: '中国',
                children: [
                  {
                    id: '1',
                    title: '子级1',
                    children: null,
                  },
                  {
                    id: '2',
                    title: '子级2',
                    children: [],
                  },
                  { id: '3', title: '子级3', children: null },
                ],
              },
            ];
            options.map(o => {
              if (o.children) {
                o.children.map((r: any) => {
                  if (r.children == null) {
                    r.isLeaf = true;
                  } else {
                    r.isLeaf = false;
                  }
                });
                o.isLeaf = false;
              } else {
                o.isLeaf = true;
              }
            });
            console.log('懒加载初始化', JSON.parse(JSON.stringify(options)));
            resolve(options);
          }
        }
      }, 1500);
    },
    loadTree2(resolve: Function, params?: any, value?: string) {
      let options: any[] = [];
      console.log('获取数据', params, value);
      const isdataRef = params ? (params.dataRef ? true : false) : false;
      setTimeout(() => {
        if (value) {
          options = [
            { id: 's1', title: '搜索1', children: [] },
            { id: 's2', title: '搜索2', children: null },
            { id: 's3', title: '搜索3', children: null },
          ];
          options.map(r => {
            if (r.children == null) {
              r.isLeaf = true;
            } else {
              r.isLeaf = false;
            }
          });
          resolve(options);
        } else {
          if (isdataRef) {
            if (params.dataRef.id == '2') {
              options = [
                { id: '21', title: '子级孙2-1', children: [] },
                { id: '22', title: '子级孙2-2', children: null },
                { id: '23', title: '子级孙2-3', children: null },
              ];
            } else if (params.dataRef.id == '21') {
              options = [
                { id: '211', title: '子级孙孙2-1-1', children: null },
                { id: '212', title: '子级孙孙2-1-2', children: [] },
                { id: '213', title: '子级孙孙2-1-3', children: null },
              ];
            } else if (params.dataRef.id == '212') {
              options = [
                { id: '2121', title: '子级孙孙孙2-1-2-1', children: null },
                { id: '2122', title: '子级孙孙孙2-1-2-2', children: null },
                { id: '2123', title: '子级孙孙孙2-1-2-3', children: null },
              ];
            }
            options.map(r => {
              if (r.children == null) {
                r.isLeaf = true;
              } else {
                r.isLeaf = false;
              }
            });
            console.log('懒加载回调', JSON.parse(JSON.stringify(options)));
            resolve(options);
          } else {
            options = [
              {
                id: '0',
                title: '中国',
                children: [
                  {
                    id: '1',
                    title: '子级1',
                    children: null,
                  },
                  { id: '2', title: '子级2', children: [] },
                  { id: '3', title: '子级3', children: null },
                ],
              },
            ];
            options.map(o => {
              if (o.children) {
                o.children.map((r: any) => {
                  if (r.children == null) {
                    r.isLeaf = true;
                  } else {
                    r.isLeaf = false;
                  }
                });
                o.isLeaf = false;
              } else {
                o.isLeaf = true;
              }
            });
            console.log('懒加载初始化', JSON.parse(JSON.stringify(options)));
            resolve(options);
          }
        }
      }, 0);
    },
    loadselect(resolve: Function, params?: any) {
      let data = [
        {
          value: 'Option1',
          label: '选择01',
        },
        {
          value: 'Option2',
          label: '选择02',
        },
        {
          value: 'Option3',
          label: '选择03',
        },
      ];
      if (params) {
        data = [
          {
            value: 'Option12',
            label: '选择22',
          },
          {
            value: 'Option22',
            label: '选择33',
          },
          {
            value: 'Option23',
            label: '选择44',
          },
        ];
      }
      console.log('是否搜索', params);
      resolve(data);
    },
    loadselect2(current: any, models: any, value: any) {
      console.log('change', current, models, value);
    },
    selectDD(resolve: Function, params?: any) {
      let data = [
        {
          id: 'dd1',
          name: 'DD01',
        },
        {
          id: 'Option2',
          name: 'DD02',
        },
        {
          id: 'Option3',
          name: 'DD03',
        },
      ];
      if (params) {
        data = [
          {
            id: 'Option12',
            name: 'AA22',
          },
          {
            id: 'Option22',
            name: 'AA33',
          },
          {
            id: 'Option23',
            name: 'AA44',
          },
        ];
      }
      console.log('是否搜索', params);
      resolve(data);
    },
    handswitch(current: any, models: any, value: any) {
      console.log('change-switch', current, models, value);
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
          on-change={(data: any) => {
            console.log('change', JSON.parse(JSON.stringify(data)));
          }}
        />

        <a-button
          onClick={() => {
            // this.$refs.generateForm.getFormItemInstance('treeSelect').excuteOption();
            // return;
            // this.type = this.type ? false : true;
            // return;
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
        <a-button
          onClick={() => {
            // this.$refs.generateForm.getFormItemInstance('treeSelect').excuteOption();
            // return;
            // this.type = this.type ? false : true;
            // return;
            this.type = this.type ? false : true;
          }}
        >
          回显切换
        </a-button>
      </div>
    );
  }
}
