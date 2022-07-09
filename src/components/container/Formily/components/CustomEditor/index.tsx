import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class CustomEditor extends Vue {
  /**
   * 编辑器内容
   */
  @Prop({
    type: String,
    default: '',
  })
  value!: string;

  /**
   * 编辑器主题
   */
  @Prop({
    type: String,
    default: 'solarized_light',
  })
  theme!: string;

  /**
   * 当前语言
   */
  @Prop({
    type: String,
    default: '',
  })
  lang!: string;

  /**
   * 高度
   */
  @Prop({
    type: String,
    default: '300',
  })
  height!: string;

  /**
   * 是否只读
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  readOnly!: boolean;

  $refs!: {
    aceEditor: any;
  };

  /**
   * 获取编辑器数据
   * @returns {string} 编辑器数据
   */
  public getValue(): string {
    return this.$refs.aceEditor.editor.getValue();
  }

  /**
   * 设置编辑器数据
   * @param value 编辑器数据
   */
  public setValue(value: string) {
    this.$refs.aceEditor.editor.setValue(value);
  }

  @Emit('change')
  private handleChange(value: string) {}

  @Watch('value')
  private handleValueChange(newVal: string) {
    this.content = newVal;
  }

  @Watch('content')
  private handleContentChange(newVal: string) {
    this.handleChange(newVal);
  }

  private content = this.value;

  private Editor = require('vue2-ace-editor'); // 加载编辑器组件

  // 初始化编辑器
  private editorInit() {
    require('brace/ext/language_tools');
    require('brace/ext/searchbox');
    require(`brace/mode/${this.lang}`);
    require(`brace/snippets/${this.lang}`);
    require(`brace/theme/${this.theme}`);
  }

  // 编辑器所需要的配置信息
  private editorConfig = {
    enableBasicAutocompletion: true, // 启用基本自动完成
    enableSnippets: true, // 是否启用代码片段 比如 js for循环
    enableLiveAutocompletion: true, // 自动补全
    tabSize: 2,
    fontSize: 14,
    showFoldWidgets: true, // 显示折叠部件
    fadeFoldWidgets: true, // 淡入折叠部件
    enableEmmet: true, // 启用Emmet
    enableMultiselect: true, // 是否启用多选
    useWorker: true, // 是否显示辅助对象，如：错误提示等
    showPrintMargin: false, // 是否显示编辑器里的竖线
    readOnly: this.readOnly, // 是否只读
  };

  render() {
    return (
      <this.Editor
        ref="aceEditor"
        vModel={this.content}
        theme={this.theme}
        lang={this.lang}
        width="100%"
        height={this.height}
        onInit={this.editorInit}
        options={this.editorConfig}
      ></this.Editor>
    );
  }
}
