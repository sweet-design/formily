import { Vue, Component } from 'vue-property-decorator';
import PageTree from './index';

@Component
export default class Demo extends Vue {
  private datas: any = [
    {
      name: '0-0',
      id: '0-0',
      count: 20,
      childrens: [
        {
          name: '0-0-0',
          id: '0-0-0',
          childrens: [
            { name: '0-0-0-0', id: '0-0-0-0' },
            { name: '0-0-0-1', id: '0-0-0-1' },
            { name: '0-0-0-2', id: '0-0-0-2' },
          ],
        },
        {
          name: '0-0-1',
          id: '0-0-1',
          childrens: [
            { name: '0-0-1-0', id: '0-0-1-0' },
            { name: '0-0-1-1', id: '0-0-1-1' },
            { name: '0-0-1-2', id: '0-0-1-2' },
          ],
        },
        {
          name: '0-0-2',
          id: '0-0-2',
        },
      ],
    },
    {
      name: '0-1',
      id: '0-1',
      count: 80,
      childrens: [
        { name: '0-1-0-0', id: '0-1-0-0' },
        { name: '0-1-0-1', id: '0-1-0-1' },
        { name: '0-1-0-2', id: '0-1-0-2' },
      ],
    },
    {
      name: '0-2',
      count: 40,
      id: '0-2',
    },
  ];

  private replaceFields = { children: 'childrens', title: 'name', key: 'id' };

  private loading = false;

  private selectedKeys: string[] = [];
  private checkedKeys: string[] = ['0-0-0-0'];
  private visible = false;

  render() {
    return (
      <PageTree
        dataSource={this.datas}
        pop
        visible={this.visible}
        selectedKeys={this.selectedKeys}
        replaceFields={this.replaceFields}
        loading={this.loading}
        checkedKeys={this.checkedKeys}
        checkable
        on={{
          ['update:selectedKeys']: (val: any) => {
            this.selectedKeys = val;
          },
          ['update:checkedKeys']: (val: any) => {
            this.checkedKeys = val;
          },
          check: () => {},
          select: () => {},
          ok: (data: any) => {
            console.log(data);
          },
          ['update:visible']: (val: any) => {
            this.visible = val;
          },
        }}
      />
    );
  }
}
