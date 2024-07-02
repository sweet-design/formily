import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import TableConfig from './TableConfig';
import ButtonItemConfig from './ButtonItemConfig';
import { advanceComponents } from '../componentsConfig';
import './WidgetConfig.less';

@Component
export default class WidgetConfig extends Vue {
  private form: any = {};

  /**
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  private validator: any = {
    // 类型校验
    type: null,
    // 必填校验
    required: null,
    // 正则校验
    pattern: null,
    // 是否是范围 一般用在时间组件
    range: null,
    // 长度校验
    length: null,
    // 自定义验证函数
    validator: null,
  };

  private currentTableColConfig: any = {}; // 当前列配置数据
  private visible = false; // 是否显示table 列配置窗口

  private buttonItemConfig: any = {}; // 按钮组 项的配置
  private isVisible = false; // 是否显示按钮组 项配置窗口

  /**
   * 处理在多选情况下 需要改变字段默认值的数据类型 多选 为Array 单选 为string
   * @param value 切换是否多选后的回调
   */
  handleSelectMuliple(value: boolean) {
    if (this.data.type === 'ddList' || this.data.type === 'imgupload') return; // 下拉列表控件单选多选都是数组

    if (value) {
      this.data.options.filterable = true; // 在select多选的情况下 默认支持搜索过滤

      if (this.data.options.defaultValue) {
        this.data.options.defaultValue = [this.data.options.defaultValue];
      } else {
        this.data.options.defaultValue = [];
      }
    } else {
      if (this.data.options.defaultValue.length > 0) {
        this.data.options.defaultValue = this.data.options.defaultValue[0];
      } else {
        this.data.options.defaultValue = '';
      }
    }
  }

  /**
   * 删除选项回调函数 包括布局和选项
   * @param index 当前索引
   */
  handleOptionsRemove(index: number) {
    this.$confirm({
      content: '确定删除吗？',
      onOk: () => {
        if (this.data.type === 'grid' || this.data.type === 'table') {
          this.data.columns.splice(index, 1);
        } else if (this.data.type === 'button') {
          this.data.options.groupList.splice(index, 1);
        } else {
          this.data.options.options.splice(index, 1);
        }
      },
    });
  }

  get show() {
    if (this.data && Object.keys(this.data).length > 0) {
      return true;
    }
    return false;
  }

  generateRule() {
    if (!this.data) return;

    this.data.rules = [];
    Object.keys(this.validator).forEach(key => {
      if (this.validator[key]) {
        this.data.rules.push(this.validator[key]);
      }
    });
  }

  /**
   * 验证是否必填
   * @param val 是否必填
   */
  validateRequired(val: boolean) {
    if (val) {
      this.validator.required = {
        required: true,
        message: `${
          this.data.type == 'imgupload' ? this.data.options.alise : this.$t(this.data.name)
        } ${this.$t('component.check.null')}`,
        trigger: ['blur', 'change'],
      };
    } else {
      this.validator.required = null;
    }

    this.$nextTick(() => {
      this.generateRule();
    });
  }

  /**
   * 验证数据格式
   * @param val 当前格式
   */
  validateDataType(val: string) {
    if (!this.show) {
      return false;
    }

    if (val) {
      this.validator.type = {
        type: val,
        message: this.$t(this.data.name) + '格式不正确',
        trigger: ['blur', 'change'],
      };
    } else {
      this.validator.type = null;
    }

    this.generateRule();
  }

  /**
   * 自定义验证器
   * @param val 驱动校验的字段列表
   */
  validateValidator(val: string[]) {
    if (!this.show) {
      return false;
    }

    if (val && val.length > 0) {
      this.validator.validator = {
        validator: ((_this: any, list: string[]) => {
          return (rule: any, value: any, callback: Function) => {
            (_this.$refs.generateForm as any).validateField(list);
            callback();
          };
        }).toString(),
      };
    } else {
      this.validator.validator = null;
    }

    this.generateRule();
  }

  /**
   * 验证正则
   * @param val 正则表达式
   * @returns
   */
  valiatePattern(val: string) {
    if (!this.show) {
      return false;
    }

    if (val) {
      this.validator.pattern = {
        pattern: val,
        message: this.$t(this.data.name) + '格式不匹配',
        trigger: ['blur', 'change'],
      };
    } else {
      this.validator.pattern = null;
    }

    this.generateRule();
  }

  @Watch('data.options.isRange')
  private isRangeChange(newVal: boolean) {
    if (typeof newVal !== 'undefined') {
      if (newVal) {
        this.data.options.defaultValue = null;
      } else {
        if (Object.keys(this.data.options).indexOf('defaultValue') >= 0)
          this.data.options.defaultValue = '';
      }
    }
  }

  @Watch('data.options.required')
  private requiredChange(newVal: boolean) {
    this.validateRequired(newVal);
  }

  @Watch('data.options.dataType')
  private dataTypeChange(newVal: string) {
    this.validateDataType(newVal);
  }

  /**
   * 监听驱动校验的字段列表
   */
  // @Watch('data.options.driveList')
  // private driveListChange(newVal: string[]) {
  // 	this.validateValidator(newVal);
  // }

  @Watch('data.options.pattern')
  private patternChange(newVal: string) {
    this.valiatePattern(newVal);
  }

  @Watch('data.name')
  private nameChange(newVal: string) {
    if (this.data && this.data.options) {
      this.validateRequired(this.data.options.required);
      this.validateDataType(this.data.options.dataType);
      this.valiatePattern(this.data.options.pattern);
    }
  }

  private handleAddOption() {
    this.data.options.options.push({
      value: 'OptionX',
      label: '新选项',
    });
  }

  /**
   * 表格组件添加列
   */
  private tableAddCol() {
    const temp: any[] = advanceComponents.filter(item => item.type === 'table');
    this.data.columns.push(JSON.parse(JSON.stringify(temp[0].columns[0])));
  }

  /**
   * 按钮组组件添加项
   */
  private buttonAddItem() {
    this.data.options.groupList.push({
      title: '默认',
      icon: 'appstore',
    });
  }

  render() {
    return (
      <div class="widget-config-wrapper">
        {this.show && (
          <a-form-model label-col={{ span: 0 }} wrapper-col={{ span: 24 }}>
            {this.data.type !== 'grid' &&
              this.data.type !== 'table' &&
              this.data.type !== 'button' && [
                <a-divider>字段标识</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input style="width: 100%;" vModel={this.data.model} />
                  </div>
                </a-form-model-item>,
                <a-divider>标题</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input style="width: 100%;" vModel={this.data.name} />
                  </div>
                </a-form-model-item>,
              ]}

            {Object.keys(this.data.options).indexOf('width') >= 0 && [
              <a-divider>宽度</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input style="width: 100%;" vModel={this.data.options.width} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('valueFormatter') >= 0 && [
              <a-divider>格式化函数</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input type="textarea" rows={5} vModel={this.data.options.valueFormatter} />
                </div>
              </a-form-model-item>,
            ]}

            {this.data.type === 'button' && [
              <a-divider>按钮名称</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input vModel={this.data.title} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('isControl') >= 0 && [
              <a-divider>是否受控</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.isControl} />
                </div>
              </a-form-model-item>,
            ]}

            {this.data.options.isControl && [
              <a-divider>受控条件</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input type="textarea" rows={5} vModel={this.data.options.controlCondition} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('labelControl') >= 0 && [
              <a-divider>自定义栅格</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.labelControl} />
                  {this.data.options.labelControl && (
                    <a-input-number
                      style="width: 100%;"
                      vModel={this.data.options.labelCol}
                      min={0}
                      max={24}
                      onChange={() => {}}
                    />
                  )}
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('onchange') >= 0 && [
              <a-divider>响应事件</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input style="width: 100%;" vModel={this.data.options.onchange} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('height') >= 0 && [
              <a-divider>高度</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number style="width: 100%;" min={0} vModel={this.data.options.height} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('size') >= 0 && [
              <a-divider>大小</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <div>
                    <span>宽度：</span>
                    <a-input-number min={30} vModel={this.data.options.size.width} />
                  </div>
                  <div>
                    <span>高度：</span>
                    <a-input-number min={30} vModel={this.data.options.size.height} />
                  </div>
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('placeholder') >= 0 &&
              (this.data.type != 'time' || this.data.type != 'date') && [
                <a-divider>占位符</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input style="width: 100%;" vModel={this.data.options.placeholder} />
                  </div>
                </a-form-model-item>,
              ]}

            {Object.keys(this.data.options).indexOf('inline') >= 0 && [
              <a-divider>布局方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-radio-group vModel={this.data.options.inline} buttonStyle="solid">
                    <a-radio-button value={false}>块级</a-radio-button>
                    <a-radio-button value={true}>行内</a-radio-button>
                  </a-radio-group>
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('float') >= 0 && [
              <a-divider>浮动方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-radio-group vModel={this.data.options.float} buttonStyle="solid">
                    <a-radio-button value="left">左浮动</a-radio-button>
                    <a-radio-button value="right">右浮动</a-radio-button>
                  </a-radio-group>
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('min') >= 0 && [
              <a-divider>最小值</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number style="width: 100%;" step={1} vModel={this.data.options.min} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('max') >= 0 && [
              <a-divider>最大值</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number style="width: 100%;" step={1} vModel={this.data.options.max} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('step') >= 0 && [
              <a-divider>步长</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={0}
                    max={100}
                    step={1}
                    vModel={this.data.options.step}
                  />
                </div>
              </a-form-model-item>,
            ]}
            {Object.keys(this.data.options).indexOf('precision') >= 0 && [
              <a-divider>数值精度</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={0}
                    max={4}
                    step={1}
                    vModel={this.data.options.precision}
                    onChange={(value: any) => {
                      if (!value) {
                        this.data.options.precision = 0;
                      }
                    }}
                  />
                </div>
              </a-form-model-item>,
            ]}

            {(this.data.type == 'select' ||
              this.data.type == 'imgupload' ||
              this.data.type == 'treeSelect' ||
              this.data.type == 'customSelector' ||
              this.data.type == 'ddList') && [
              <a-divider>是否多选</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch
                    vModel={this.data.options.multiple}
                    onChange={this.handleSelectMuliple}
                  />
                </div>
              </a-form-model-item>,
            ]}

            {this.data.type == 'ddList' && [
              <a-divider>搜索类型</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.searchType}>
                    <a-select-option value="SysRole">系统角色</a-select-option>
                    <a-select-option value="HrEmp">人员列表</a-select-option>
                    <a-select-option value="HrPost">岗位列表</a-select-option>
                    <a-select-option value="HrPostion">职位列表</a-select-option>
                    <a-select-option value="HrRank">职级列表</a-select-option>
                    <a-select-option value="HrGroup">工作组列表</a-select-option>
                    <a-select-option value="WhsTask">任务列表</a-select-option>
                    <a-select-option value="HrCostCenter">成本中心</a-select-option>
                    <a-select-option value="HrPlace">工作地点</a-select-option>
                    <a-select-option value="HrGroupEmp">工作组人员数据</a-select-option>
                    <a-select-option value="BasicProvince">户籍(省级)</a-select-option>
                    <a-select-option value="BasicCounty">工作地点(县)</a-select-option>
                    <a-select-option value="AttCalendar">考勤日历</a-select-option>
                    <a-select-option value="AttQishu">考勤期数</a-select-option>
                    <a-select-option value="HUJI">户籍</a-select-option>
                    <a-select-option value="HrStore">门店列表</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
              <a-divider>查询参数</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input vModel={this.data.options.searchParams} />
                </div>
              </a-form-model-item>,
              <a-divider>初始搜索</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.autoSearch} />
                </div>
              </a-form-model-item>,
              <a-divider>搜索返回条目数</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={-1}
                    step={1}
                    vModel={this.data.options.count}
                  />
                </div>
              </a-form-model-item>,
            ]}

            {this.data.type == 'customSelector' && [
              <a-divider>选择器类型</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.type}>
                    <a-select-option value="user-selector">人员选择器</a-select-option>
                    <a-select-option disabled value="list-selector">
                      列表选择器
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
            ]}

            {this.data.type == 'treeSelect' && [
              <a-divider>是否懒加载</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.asyncLoad} />
                </div>
              </a-form-model-item>,
              <a-divider>回填方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.showCheckedStrategy}>
                    <a-select-option value="SHOW_ALL">显示所有节点</a-select-option>
                    <a-select-option value="SHOW_PARENT">只显示父节点</a-select-option>
                    <a-select-option value="SHOW_CHILD">只显示子节点</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('assistField') >= 0 && [
              <a-divider>辅助字段</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input style="width: 100%;" vModel={this.data.options.assistField} />
                </div>
              </a-form-model-item>,
            ]}

            {(this.data.type == 'select' || this.data.type == 'treeSelect') && [
              <a-divider>是否可搜索</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch
                    vModel={this.data.options.filterable}
                    disabled={this.data.options.multiple}
                  />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('allowHalf') >= 0 && [
              <a-divider>允许半选</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.allowHalf} />
                </div>
              </a-form-model-item>,
            ]}

            {Object.keys(this.data.options).indexOf('showLabel') >= 0 && [
              <a-divider>是否显示标签</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.showLabel} />
                </div>
              </a-form-model-item>,
            ]}

            {/* 表格配置 */}
            {Object.keys(this.data).indexOf('columns') >= 0 &&
              this.data.type == 'table' && [
                <a-divider>是否显示边框</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-switch vModel={this.data.border} />
                  </div>
                </a-form-model-item>,
                <a-divider>是否显示分页</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-switch vModel={this.data.page} />
                  </div>
                </a-form-model-item>,
                <a-divider>是否启用选择列</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-switch vModel={this.data.showSelectCol} />
                  </div>
                </a-form-model-item>,
                this.data.showSelectCol && (
                  <a-form-model-item>
                    <div class="feild-item">
                      <a-input
                        type="textarea"
                        rows={5}
                        placeholder="选项发生变化后的回调函数"
                        vModel={this.data.rowSelection.onChange}
                      />
                    </div>
                  </a-form-model-item>
                ),
                <a-divider>主键名</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input vModel={this.data.primaryKey} />
                  </div>
                </a-form-model-item>,
                <a-divider>大小</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-select vModel={this.data.size}>
                      <a-select-option value="default">默认</a-select-option>
                      <a-select-option value="middle">中等</a-select-option>
                      <a-select-option value="small">小</a-select-option>
                    </a-select>
                  </div>
                </a-form-model-item>,
                <a-divider>表格类型</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-select vModel={this.data.tableType}>
                      <a-select-option value="default">默认表格</a-select-option>
                      <a-select-option value="listTree">列表树</a-select-option>
                      <a-select-option value="nested">嵌套表格</a-select-option>
                    </a-select>
                  </div>
                </a-form-model-item>,
                <a-divider>加载模式</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-select vModel={this.data.loadMode}>
                      <a-select-option value="all">全量加载</a-select-option>
                      <a-select-option value="lazy">按需加载</a-select-option>
                    </a-select>
                  </div>
                </a-form-model-item>,
                <a-divider>高度</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input-number vModel={this.data.height} />
                  </div>
                </a-form-model-item>,
                <a-divider>宽度</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input-number vModel={this.data.width} />
                  </div>
                </a-form-model-item>,
                <a-divider>列配置</a-divider>,
                this.data.type == 'table' && (
                  <Draggable
                    tag="ul"
                    list={this.data.columns}
                    group={{ name: 'options' }}
                    ghostClass="ghost"
                    handle=".drag-item"
                    class="drag-sort"
                  >
                    {this.data.columns.map((item: any, index: number) => {
                      return (
                        <li key={index}>
                          <a-input vModel={item.title} style="width: 100px; margin-right: 8px;" />
                          <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                          <a-button
                            onClick={() => {
                              this.currentTableColConfig = item;
                              this.visible = true;
                            }}
                            icon="edit"
                            type="primary"
                            style="margin-right: 5px;"
                          ></a-button>
                          <a-button
                            onClick={this.handleOptionsRemove.bind(this, index)}
                            icon="delete"
                            type="danger"
                          ></a-button>
                        </li>
                      );
                    })}
                  </Draggable>
                ),
                <div style="margin-left: 22px;">
                  <a-button type="link" onClick={this.tableAddCol}>
                    添加选项
                  </a-button>
                </div>,
              ]}

            {Object.keys(this.data.options).indexOf('options') >= 0 && [
              <a-divider>选项配置</a-divider>,
              <div class="feild-item" style="width: 100%; margin-bottom: 20px;">
                <a-radio-group vModel={this.data.options.remote} buttonStyle="solid">
                  <a-radio-button value={false}>静态数据</a-radio-button>
                  <a-radio-button value={true}>远端数据</a-radio-button>
                </a-radio-group>
              </div>,
              this.data.options.remote ? (
                <div class="feild-item" style="width: 100%;">
                  <a-input addon-before="远端方法" vModel={this.data.options.remoteFunc} />
                  <a-input
                    addon-before="值"
                    vModel={this.data.options.props.value}
                    style="margin: 10px 0;"
                  />
                  <a-input
                    addon-before="标签"
                    vModel={this.data.options.props.label}
                    style="margin-bottom: 10px;"
                  />
                </div>
              ) : this.data.type == 'radio' ||
                (this.data.type == 'select' && !this.data.options.multiple) ? (
                <a-radio-group vModel={this.data.options.defaultValue}>
                  <Draggable
                    tag="ul"
                    list={this.data.options.options}
                    group={{ name: 'options' }}
                    ghostClass="ghost"
                    handle=".drag-item"
                    class="drag-sort"
                  >
                    {this.data.options.options.map((item: any, index: number) => {
                      return (
                        <li key={index}>
                          <a-radio
                            value={item.value}
                            style="margin-right: 0; white-space: nowrap; width: 168px;"
                          >
                            <a-input
                              style={{
                                width: this.data.options.showLabel ? '68px' : '136px',
                              }}
                              vModel={item.value}
                            />
                            {this.data.options.showLabel && (
                              <a-input style="width:68px;" vModel={item.label} />
                            )}
                          </a-radio>
                          <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                          <a-button
                            onClick={this.handleOptionsRemove.bind(this, index)}
                            icon="delete"
                            type="danger"
                          ></a-button>
                        </li>
                      );
                    })}
                  </Draggable>
                </a-radio-group>
              ) : this.data.type == 'checkbox' ||
                (this.data.type == 'select' && this.data.options.multiple) ? (
                <a-checkbox-group vModel={this.data.options.defaultValue}>
                  <Draggable
                    tag="ul"
                    list={this.data.options.options}
                    group={{ name: 'options' }}
                    ghostClass="ghost"
                    handle=".drag-item"
                    class="drag-sort"
                  >
                    {this.data.options.options.map((item: any, index: number) => {
                      return (
                        <li key={index}>
                          <a-checkbox
                            value={item.value}
                            style="margin-right: 0; white-space: nowrap; width: 168px;"
                          >
                            <a-input
                              style={{
                                width: this.data.options.showLabel ? '68px' : '136px',
                              }}
                              vModel={item.value}
                            />
                            {this.data.options.showLabel && (
                              <a-input style="width:68px;" vModel={item.label} />
                            )}
                          </a-checkbox>
                          <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                          <a-button
                            onClick={this.handleOptionsRemove.bind(this, index)}
                            icon="delete"
                            type="danger"
                          ></a-button>
                        </li>
                      );
                    })}
                  </Draggable>
                </a-checkbox-group>
              ) : null,
              !this.data.options.remote && (
                <div style="margin-left: 22px;">
                  <a-button type="link" onClick={this.handleAddOption}>
                    添加选项
                  </a-button>
                </div>
              ),
            ]}

            {this.data.type == 'button' && [
              <a-divider>是否按钮组</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.group} />
                </div>
              </a-form-model-item>,
              this.data.options.group && [
                <a-divider>按钮组列表</a-divider>,
                <Draggable
                  tag="ul"
                  list={this.data.options.groupList}
                  group={{ name: 'options' }}
                  ghostClass="ghost"
                  handle=".drag-item"
                  class="drag-sort"
                >
                  {this.data.options.groupList.map((item: any, index: number) => {
                    return (
                      <li key={index}>
                        <a-input vModel={item.title} style="width: 100px; margin-right: 8px;" />
                        <a-icon class="drag-item" type="menu" style="margin-right: 5px;" />
                        <a-button
                          onClick={() => {
                            this.buttonItemConfig = item;
                            this.isVisible = true;
                          }}
                          icon="edit"
                          type="primary"
                          style="margin-right: 5px;"
                        ></a-button>
                        <a-button
                          onClick={this.handleOptionsRemove.bind(this, index)}
                          icon="delete"
                          type="danger"
                        ></a-button>
                      </li>
                    );
                  })}
                </Draggable>,
                <div style="margin-left: 22px;">
                  <a-button type="link" onClick={this.buttonAddItem}>
                    添加选项
                  </a-button>
                </div>,
              ],
              <a-divider>按钮类型</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select
                    vModel={this.data.options.type}
                    onChange={(value: string) => {
                      // if (value === 'datetimerange' || value === 'daterange') {
                      // 	this.handleSelectMuliple(true);
                      // } else {
                      // 	this.handleSelectMuliple(false);
                      // }
                    }}
                  >
                    <a-select-option value="primary">primary</a-select-option>
                    <a-select-option value="dashed">dashed</a-select-option>
                    <a-select-option value="danger">danger</a-select-option>
                    <a-select-option value="default">default</a-select-option>
                    <a-select-option value="link">link</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
              <a-divider>水平对齐方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.justify} onChange={(value: string) => {}}>
                    <a-select-option value="left">左对齐</a-select-option>
                    <a-select-option value="center">居中对齐</a-select-option>
                    <a-select-option value="right">右对齐</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
              <a-divider>图标</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input vModel={this.data.options.icon} />
                </div>
              </a-form-model-item>,
              <a-divider>按钮样式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input type="textarea" rows={5} vModel={this.data.options.customStyle} />
                </div>
              </a-form-model-item>,
              !this.data.options.group && [
                <a-divider>事件方法</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-input vModel={this.data.options.handleEvent} />
                  </div>
                </a-form-model-item>,
              ],
            ]}

            {(this.data.type == 'cascader' || this.data.type == 'treeSelect') && [
              <a-divider>远端数据</a-divider>,
              <div class="feild-item" style="width: 100%;">
                <a-input addon-before="远端方法" vModel={this.data.options.remoteFunc} />
                <a-input
                  addon-before="值"
                  vModel={this.data.options.props.value}
                  style="margin: 10px 0;"
                />
                <a-input
                  addon-before="标签"
                  vModel={this.data.options.props.label}
                  style="margin-bottom: 10px;"
                />
                <a-input
                  addon-before="子选项"
                  vModel={this.data.options.props.children}
                  style="margin-bottom: 10px;"
                />
              </div>,
            ]}

            {Object.keys(this.data.options).indexOf('defaultValue') >= 0 &&
              (this.data.type == 'textarea' ||
                this.data.type == 'input' ||
                this.data.type == 'rate' ||
                this.data.type == 'color' ||
                this.data.type == 'switch' ||
                this.data.type == 'text' ||
                this.data.type == 'html') && [
                <a-divider>默认值</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    {(this.data.type == 'textarea' || this.data.type == 'html') && (
                      <a-input type="textarea" rows={5} vModel={this.data.options.defaultValue} />
                    )}
                    {(this.data.type == 'input' || this.data.type == 'text') && (
                      <a-input vModel={this.data.options.defaultValue} />
                    )}
                    {this.data.type == 'switch' && (
                      <a-switch vModel={this.data.options.defaultValue} />
                    )}
                  </div>
                </a-form-model-item>,
              ]}

            {this.data.type == 'html' && [
              <a-divider>远端方法</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input vModel={this.data.options.remoteFunc} />
                </div>
              </a-form-model-item>,
            ]}

            {/* 时间日期组件判断 */}
            {(this.data.type == 'time' || this.data.type == 'date') && [
              this.data.type == 'date' && [
                <a-divider>显示类型</a-divider>,
                <a-form-model-item>
                  <div class="feild-item">
                    <a-select
                      vModel={this.data.options.type}
                      onChange={(value: string) => {
                        if (value === 'datetimerange' || value === 'daterange') {
                          this.handleSelectMuliple(true);
                        } else {
                          this.handleSelectMuliple(false);
                        }
                      }}
                    >
                      <a-select-option value="year">year</a-select-option>
                      <a-select-option value="month">month</a-select-option>
                      <a-select-option value="date">date</a-select-option>
                      {/* <a-select-option value="dates">dates</a-select-option> */}
                      <a-select-option value="datetime">datetime</a-select-option>
                      <a-select-option value="datetimerange">datetimerange</a-select-option>,
                      <a-select-option value="daterange">daterange</a-select-option>
                    </a-select>
                  </div>
                </a-form-model-item>,
                // <a-divider>是否获取时间戳</a-divider>,
                // <a-form-model-item>
                // 	<div class="feild-item">
                // 		<a-switch vModel={this.data.options.timestamp} />
                // 	</div>
                // </a-form-model-item>
              ],
              this.data.type == 'time' &&
                Object.keys(this.data.options).indexOf('isRange') >= 0 && [
                  <a-divider>是否为范围选择</a-divider>,
                  <a-form-model-item>
                    <div class="feild-item">
                      <a-switch
                        vModel={this.data.options.isRange}
                        onChange={(checked: boolean) => {
                          this.data.options.defaultValue = checked ? [] : '';
                        }}
                      />
                    </div>
                  </a-form-model-item>,
                ],
              this.data.options.isRange ||
              this.data.options.type == 'datetimerange' ||
              this.data.options.type == 'datetime' ||
              this.data.type == 'time'
                ? [
                    <a-divider>小时步长</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input-number
                          min={1}
                          max={23}
                          vModel={this.data.options.hourStep}
                          onChange={(value: any) => {
                            if (!value) {
                              this.data.options.hourStep = 1;
                            }
                          }}
                        />
                      </div>
                    </a-form-model-item>,
                    <a-divider>分钟步长</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input-number
                          min={1}
                          max={59}
                          onChange={(value: any) => {
                            if (!value) {
                              this.data.options.minuteStep = 1;
                            }
                          }}
                          vModel={this.data.options.minuteStep}
                        />
                      </div>
                    </a-form-model-item>,
                    <a-divider>秒数步长</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input-number
                          min={1}
                          max={59}
                          vModel={this.data.options.secondStep}
                          onChange={(value: any) => {
                            if (!value) {
                              this.data.options.secondStep = 1;
                            }
                          }}
                        />
                      </div>
                    </a-form-model-item>,
                  ]
                : null,
              this.data.options.isRange ||
              this.data.options.type == 'datetimerange' ||
              this.data.options.type == 'daterange'
                ? [
                    <a-divider>开始时间占位符</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input vModel={this.data.options.startPlaceholder} />
                      </div>
                    </a-form-model-item>,
                    <a-divider>结束时间占位符</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input vModel={this.data.options.endPlaceholder} />
                      </div>
                    </a-form-model-item>,
                  ]
                : null,
              <a-divider>格式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input vModel={this.data.options.format} />
                </div>
              </a-form-model-item>,
              // this.data.type == 'time' &&
              // 	Object.keys(this.data.options).indexOf('isRange') >= 0 && [
              // 		<a-divider>默认值</a-divider>,
              // 		<a-form-model-item>
              // 			<div class="feild-item">
              // 				<a-time-picker
              // 					style="width: 100%;"
              // 					format={this.data.options.format}
              // 					vModel={this.data.options.defaultValue}
              // 				/>
              // 			</div>
              // 		</a-form-model-item>
              // 	]
            ]}

            {this.data.type == 'imgupload' && [
              <a-divider>是否支持相机拍照上传(H5)</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.isCamera} />
                </div>
              </a-form-model-item>,
              <a-divider>是否支持使用相册上传(H5)</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch vModel={this.data.options.isAlbum} />
                </div>
              </a-form-model-item>,
              <a-divider>附件别名</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input style="width: 100%;" vModel={this.data.options.alise} />
                </div>
              </a-form-model-item>,
              <a-divider>最大上传数量</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={1}
                    step={1}
                    vModel={this.data.options.length}
                    onChange={(value: any) => {
                      if (!value) {
                        this.data.options.length = 1;
                      }
                    }}
                  />
                </div>
              </a-form-model-item>,
              <a-divider>最大上传大小(M)</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={1}
                    step={1}
                    vModel={this.data.options.maxSize}
                    onChange={(value: any) => {
                      if (!value) {
                        this.data.options.maxSize = 1;
                      }
                    }}
                  />
                </div>
              </a-form-model-item>,
              <a-divider>上传文件类型</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input
                    style="width: 100%;"
                    placeholder=".jpg,.png,.jpeg"
                    vModel={this.data.options.accept}
                  />
                </div>
              </a-form-model-item>,
              <a-divider>所属模块</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input style="width: 100%;" vModel={this.data.options.module} />
                </div>
              </a-form-model-item>,
              <a-divider>使用阿里云上传</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-switch disabled vModel={this.data.options.isAliyun} />
                </div>
              </a-form-model-item>,
              <a-divider>附件示例</a-divider>,
              <this.plugins.Upload
                key={this.data.key}
                accept={this.data.options.accept}
                showType="1"
                maxSize={this.data.options.maxSize * 1024 * 1024}
                multiUploadSize={100 * 1024 * 1024}
                length={this.data.options.length}
                data={{ module: this.data.options.module }}
                fileList={this.data.options.fileExample}
                singleUrl={this.data.options.action}
                del={true}
                disabled={false}
                multiple={this.data.options.multiple}
                alise="示例"
                onSuccess={(data: any[]) => {
                  this.data.options.fileExample = data.map(file => ({
                    key: this.data.model,
                    keyName: this.data.name,
                    uid: file.id,
                    url: file.url,
                    name: file.name,
                    status: file.status,
                    path: file.path,
                    storageId: file.id,
                    storageName: file.name,
                    storageType: file.contentType,
                    storageUrl: file.url,
                  }));
                }}
                onRemove={(data: any) => {
                  this.data.options.fileExample = this.data.options.fileExample.filter(
                    (item: any) => item.path != data.path,
                  );
                }}
                onError={(error: any) => {
                  console.log(error);
                }}
              />,
              this.data.options.isAliyun
                ? [
                    <a-divider>域名</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input vModel={this.data.options.domain} />
                      </div>
                    </a-form-model-item>,
                    <a-divider>获取Token方法</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input vModel={this.data.options.tokenFunc} />
                      </div>
                    </a-form-model-item>,
                  ]
                : [
                    <a-divider>图片上传地址</a-divider>,
                    <a-form-model-item>
                      <div class="feild-item">
                        <a-input vModel={this.data.options.action} />
                      </div>
                    </a-form-model-item>,
                  ],
            ]}

            {this.data.type === 'grid' && [
              <a-divider>栅格间隔</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-input-number
                    style="width: 100%;"
                    min={0}
                    step={10}
                    value={this.data.options.gutter}
                    onChange={(value: number | string) => {
                      if (typeof value == 'string') {
                        this.data.options.gutter = 0;
                      } else {
                        this.data.options.gutter = value;
                      }
                    }}
                  />
                </div>
              </a-form-model-item>,
              <a-divider>列配置项</a-divider>,
              <Draggable
                tag="ul"
                list={this.data.columns}
                group={{ name: 'options' }}
                ghostClass="ghost"
                handle=".drag-item"
                class="drag-sort"
              >
                {this.data.columns.map((item: any, index: number) => {
                  return (
                    <li key={index}>
                      <a-icon class="drag-item" type="menu" />
                      <a-input-number
                        min={0}
                        placeholder="栅格值"
                        style="margin: 0 10px;"
                        vModel={item.span}
                      />
                      <a-button
                        onClick={this.handleOptionsRemove.bind(this, index)}
                        icon="delete"
                        type="danger"
                      ></a-button>
                    </li>
                  );
                })}
              </Draggable>,
              <div class="feild-item">
                <a-button
                  type="link"
                  onClick={() => {
                    this.data.columns.push({
                      span: '',
                      list: [],
                    });
                  }}
                >
                  添加选项
                </a-button>
              </div>,
              <a-divider>水平排列方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.justify}>
                    <a-select-option value="start">左对齐</a-select-option>
                    <a-select-option value="end">右对齐</a-select-option>
                    <a-select-option value="center">居中对齐</a-select-option>
                    <a-select-option value="space-around">两侧间隔相等</a-select-option>
                    <a-select-option value="space-between">两端对齐</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
              <a-divider>垂直排列方式</a-divider>,
              <a-form-model-item>
                <div class="feild-item">
                  <a-select vModel={this.data.options.align}>
                    <a-select-option value="top">顶部对齐</a-select-option>
                    <a-select-option value="middle">居中对齐</a-select-option>
                    <a-select-option value="bottom">底部对齐</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>,
            ]}

            {this.data.type !== 'grid' &&
              this.data.type !== 'html' &&
              this.data.type !== 'table' && [
                <a-divider>操作属性</a-divider>,
                <div class="feild-item" style="width: 100%;">
                  {Object.keys(this.data.options).indexOf('readonly') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.readonly}>
                      是否只读
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('disabled') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.disabled}>
                      是否禁用
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('editable') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.editable}>
                      文本框可输入
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('clearable') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.clearable}>
                      显示清除按钮
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('arrowControl') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.arrowControl}>
                      使用箭头进行时间选择
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('isDelete') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.isDelete}>
                      删除
                    </a-checkbox>
                  )}
                  {Object.keys(this.data.options).indexOf('isEdit') >= 0 && (
                    <a-checkbox style="margin: 0 0 10px;" vModel={this.data.options.isEdit}>
                      编辑
                    </a-checkbox>
                  )}
                </div>,
                this.data.type !== 'button' && this.data.type !== 'html' && (
                  <a-divider>基础校验</a-divider>
                ),
                <div class="feild-item">
                  {Object.keys(this.data.options).indexOf('required') >= 0 && (
                    <a-checkbox vModel={this.data.options.required}>是否必填</a-checkbox>
                  )}
                </div>,
                <div class="feild-item" style="margin-top: 20px;">
                  {Object.keys(this.data.options).indexOf('dataType') >= 0 && (
                    <a-select vModel={this.data.options.dataType}>
                      <a-select-option value="string">字符串</a-select-option>
                      <a-select-option value="number">数字</a-select-option>
                      {/* <a-select-option value="boolean">布尔值</a-select-option> */}
                      <a-select-option value="integer">整数</a-select-option>
                      <a-select-option value="float">浮点数</a-select-option>
                      <a-select-option value="url">URL地址</a-select-option>
                      <a-select-option value="email">邮箱地址</a-select-option>
                      {/* <a-select-option value="hex">十六进制</a-select-option> */}
                    </a-select>
                  )}
                </div>,
                <div class="feild-item" style="margin-top: 20px;">
                  {Object.keys(this.data.options).indexOf('pattern') >= 0 && (
                    <a-input vModel={this.data.options.pattern} placeholder="正则表达式" />
                  )}
                </div>,
                this.data.type !== 'button' && this.data.type !== 'html' && (
                  <a-divider>高级校验</a-divider>
                ),
                Object.keys(this.data.options).indexOf('advanceRuleType') >= 0 && (
                  <div class="feild-item" style="margin-top: 20px; width: 100%;">
                    <a-row align="middle" type="flex">
                      <a-col span={8}>校验类型</a-col>
                      <a-col span={16}>
                        <a-select
                          vModel={this.data.options.advanceRuleType}
                          placeholder="校验类型"
                          onChange={() => {
                            // this.data.options.driveList = [];
                          }}
                        >
                          <a-select-option value="">不校验</a-select-option>
                          <a-select-option value="drive">驱动校验</a-select-option>
                          {(this.data.type == 'date' ||
                            this.data.type == 'time' ||
                            this.data.type == 'number') && (
                            <a-select-option value="range">范围校验</a-select-option>
                          )}
                          <a-select-option value="custom">自定义校验</a-select-option>
                        </a-select>
                      </a-col>
                    </a-row>
                    <div style="margin-top: 20px;"></div>
                    {Object.keys(this.data.options).indexOf('driveList') >= 0 &&
                      this.data.options.advanceRuleType == 'drive' && (
                        <a-row align="middle" type="flex">
                          <a-col span={8}>校验字段</a-col>
                          <a-col span={16}>
                            <a-select
                              mode="tags"
                              style="width: 100%"
                              placeholder="字段"
                              vModel={this.data.options.driveList}
                            ></a-select>
                          </a-col>
                        </a-row>
                      )}
                    <div style="margin-top: 20px;"></div>
                    {Object.keys(this.data.options).indexOf('rangeRuleObj') >= 0 &&
                      this.data.options.advanceRuleType == 'range' && [
                        <a-row align="middle" type="flex">
                          <a-col span={8}>校验字段</a-col>
                          <a-col span={16}>
                            <a-input
                              style="width: 100%"
                              placeholder="校验字段"
                              vModel={this.data.options.rangeRuleObj.field}
                            />
                          </a-col>
                        </a-row>,
                        <div style="margin-top: 20px;"></div>,
                        <a-row align="middle" type="flex">
                          <a-col span={8}>字段条件</a-col>
                          <a-col span={16}>
                            <a-select
                              vModel={this.data.options.rangeRuleObj.condition}
                              placeholder="字段条件"
                            >
                              <a-select-option value=">">大于</a-select-option>
                              <a-select-option value="<">小于</a-select-option>
                              <a-select-option value="==">相等</a-select-option>
                              <a-select-option value=">=">大于等于</a-select-option>
                              <a-select-option value="<=">小于等于</a-select-option>
                              <a-select-option value="!=">不等</a-select-option>
                              <a-select-option value="-">取差</a-select-option>
                              <a-select-option value="+">求和</a-select-option>
                              <a-select-option value="%">取模</a-select-option>
                            </a-select>
                          </a-col>
                        </a-row>,
                        <div style="margin-top: 20px;"></div>,
                        <a-row align="middle" type="flex">
                          <a-col span={8}>目标值</a-col>
                          <a-col span={16}>
                            <a-input-number
                              style="width: 100%;"
                              vModel={this.data.options.rangeRuleObj.target}
                              placeholder="目标值"
                            />
                          </a-col>
                        </a-row>,
                        <div style="margin-top: 20px;"></div>,
                        <a-row align="middle" type="flex">
                          <a-col span={8}>单位</a-col>
                          <a-col span={16}>
                            <a-select
                              vModel={this.data.options.rangeRuleObj.unit}
                              placeholder="单位"
                            >
                              <a-select-option value="default">默认</a-select-option>
                              <a-select-option value="minute">分钟</a-select-option>
                              <a-select-option value="hour">小时</a-select-option>
                              <a-select-option value="day">天</a-select-option>
                              <a-select-option value="years">年</a-select-option>
                            </a-select>
                          </a-col>
                        </a-row>,
                        <div style="margin-top: 20px;"></div>,
                        <a-row align="middle" type="flex">
                          <a-col span={8}>提示信息</a-col>
                          <a-col span={16}>
                            <a-input
                              vModel={this.data.options.rangeRuleObj.message}
                              placeholder="提示信息"
                            />
                          </a-col>
                        </a-row>,
                      ]}
                    <div style="margin-top: 20px;"></div>
                    {Object.keys(this.data.options).indexOf('customRuleFunc') >= 0 &&
                      this.data.options.advanceRuleType == 'custom' && (
                        <a-input
                          type="textarea"
                          placeholder="自定义校验函数"
                          rows={5}
                          vModel={this.data.options.customRuleFunc}
                        />
                      )}
                  </div>
                ),
              ]}
          </a-form-model>
        )}

        {this.visible && (
          <TableConfig
            config={this.currentTableColConfig}
            visible={this.visible}
            on={{
              ['update:config']: (value: any) => {
                this.currentTableColConfig = value;
              },
            }}
            onClose={(state: boolean) => (this.visible = state)}
          />
        )}

        {this.isVisible && (
          <ButtonItemConfig
            config={this.buttonItemConfig}
            visible={this.isVisible}
            on={{
              ['update:config']: (value: any) => {
                this.buttonItemConfig = value;
              },
            }}
            onClose={(state: boolean) => (this.isVisible = state)}
          />
        )}
      </div>
    );
  }
}
