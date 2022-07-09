import { Vue, Component } from 'vue-property-decorator';
import Upload from '@/components/container/Upload';

@Component
export default class QueryList extends Vue {
  private visible = false;
  private fileList = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ];

  render() {
    return (
      <div class="query-list-wrapper">
        <a-button
          onClick={() => {
            this.visible = true;
          }}
        >
          打开
        </a-button>

        <Upload
          visible={this.visible}
          accept=".jpg"
          fileList={this.fileList}
          on={{
            ['update:visible']: (value: boolean) => {
              this.visible = value;
            },
            ok: (data: any[]) => {
              console.log(data);
            },
          }}
        />
      </div>
    );
  }
}
