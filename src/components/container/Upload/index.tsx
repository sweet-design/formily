import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { getSize, singleUpload, splitUpload } from './sliceUpload';
import './index.less';

@Component
export default class Upload extends Vue {
  /**
   * 弹出框标题
   */
  @Prop({
    type: String,
    default: '文件上传',
  })
  title!: string;

  /**
   * 接受上传的文件类型，默认所有
   */
  @Prop({
    type: String,
    default: '',
  })
  accept!: string;

  /**
   * 是否显示弹出框
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 已经上传的文件列表
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  fileList!: any[];

  /**
   * 弹出框宽度
   */
  @Prop({
    type: String,
    default: '40%',
  })
  width!: string;

  /**
   * 单个上传url
   */
  @Prop({
    type: String,
    default: 'api.BusFile.UploadIForm',
  })
  singleUrl!: string;

  /**
   * 分片上传的url
   */
  @Prop({
    type: String,
    default: '',
  })
  splitUrl!: string;

  /**
   * 上传文件最大值 默认 100M 此参数单位为字节
   */
  @Prop({
    type: Number,
    default: 100 * 1024 * 1024,
  })
  maxSize!: number;

  /**
   * 大于这个大小的文件自动使用分片上传(后端可以支持断点续传) 10M 单位字节
   */
  @Prop({
    type: Number,
    default: 10 * 1024 * 1024,
  })
  multiUploadSize!: number;

  /**
   * 分片上传时，每片文件大小 2M 单位 字节
   */
  @Prop({
    type: Number,
    default: 2 * 1024 * 1024,
  })
  chunkSize!: number;

  /**
   * 上传组件显示方式 0.弹窗模式 1.页面模式
   */
  @Prop({
    type: String,
    default: '0',
  })
  showType!: string;

  /**
   * 是否允许多选
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  multiple!: boolean;

  /**
   * 是否允许删除
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  del!: boolean;

  /**
   * 是否禁用
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;

  /**
   * 最大上传数量
   */
  @Prop({
    type: Number,
    default: 8,
  })
  length!: number;

  /**
   * 上传附件别名
   */
  @Prop({
    type: String,
    default: '上传附件',
  })
  alise!: string;

  /**
   * 业务参数
   */
  @Prop({
    type: Object,
    default: () => ({
      /**
       * 模块名称
       */
      module: 'hr',
      /**
       * 分组
       */
      group: 'leave',
      /**
       * 缩略图模式
       */
      mode: 2,
      /**
       * 缩略图宽度
       */
      width: 100,
      /**
       * 缩略图高度
       */
      height: 100,
    }),
  })
  data!: object;

  @Emit('update:visible')
  private updateVisible(newVal: boolean) {}

  @Emit('ok')
  private handleOk(val: any[]) {}

  /**
   * 页面模式下上传成功回调
   * @param val
   */
  @Emit('success')
  private handleSuccess(val: any[]) {}

  /**
   * 页面模式下上传错误回调
   * @param val
   */
  @Emit('error')
  private handleError(val: any[]) {}

  /**
   * 页面模式下删除附件回调
   * @param val
   */
  @Emit('remove')
  private handleRemove(val: any) {}

  /**
   * 上传前校验
   * @param file 当前文件
   * @param fileList 当前文件列表
   * @returns boolean
   */
  private beforeUpload(file: File, fileList: File[]) {
    if (file.size > this.maxSize) {
      this.$message.error(`您选择的文件大于${getSize(this.maxSize)}`);
      return false;
    }
  }

  private transFileList = JSON.parse(JSON.stringify(this.fileList));

  /**
   * 自定义上传
   * @param options 文件及相关属性数据
   */
  async customRequest(options: any) {
    const status = options.file.size > this.multiUploadSize;
    // 上传方法
    const uploadFunc = status ? splitUpload : singleUpload;
    // 上传地址
    const url = status ? this.splitUrl : this.singleUrl;

    try {
      const res = await uploadFunc(
        options.file,
        this.data,
        options.onProgress,
        url,
        this.chunkSize,
      );

      /* if (response.code === 200) {
				this.$message.success('上传成功');
				options.onSuccess(response);
			} else {
				this.$message.error('上传失败');
				options.onError(response);
			} */

      this.$message.success('上传成功');
      options.onSuccess(res.response);

      this.showType == '1' && this.handleSuccess(this.transFileList);
    } catch (e) {
      const _e: any = e;
      this.$message.error(_e.message);
      options.onError(e);
      this.showType == '1' && this.handleError(_e);
    }

    const prom: any = new Promise((resolve, reject) => {});
    prom.abort = () => {};
    return prom;
  }

  render() {
    const core = (
      <a-upload
        accept={this.accept}
        name="file"
        fileList={this.transFileList}
        multiple={this.multiple}
        listType="picture-card"
        data={this.data}
        disabled={this.disabled}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: this.del }}
        remove={(file: any) => {
          this.handleRemove(file);
        }}
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onChange={(data: any) => {
          // 此方法会在文件上传过程中一直调用，知道成功或者失败
          let fileList = [...data.fileList];

          fileList = fileList.map(file => {
            if (file.response) {
              file.url =
                'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
              file.uid = file.response[0].fileId;
            }

            return file;
          });

          this.transFileList = fileList;
        }}
      >
        {this.transFileList.length < this.length
          ? [
              <a-icon type="cloud-upload" style="font-size: 24px;" />,
              <div class="ant-upload-text">{this.alise}</div>,
            ]
          : null}
      </a-upload>
    );

    return this.showType == '0' ? (
      <a-modal
        id="upload"
        wrapClassName="component-pop-upload"
        title={this.title}
        visible={this.visible}
        width={this.width}
        keyboard={false}
        maskClosable={false}
        centered
        on={{
          ok: () => {
            this.handleOk(this.transFileList);
            this.updateVisible(false);
          },
          cancel: () => {
            this.updateVisible(false);
          },
        }}
      >
        {core}
      </a-modal>
    ) : (
      core
    );
  }
}
