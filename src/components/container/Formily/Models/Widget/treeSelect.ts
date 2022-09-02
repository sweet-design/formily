export type TreeSelectModel = {
  fieldProperties: {
    cate: string;
    type: string;
    name: string;
    title: string;
    titleLangKey: string;
    description: string;
    descriptionLangKey: string;
    display: string;
    pattern: string;
    valueFormatter: string;
    defaultValue: {
      value: string;
      dataType: string;
    };
    dataSource: string;
    dynamicDataSource: string;
    staticDatas: Array<{ [key: string]: any }>;
    apiParams: { key: string | undefined; args: string; callback: string };
    jsVar: string;
    functionName: string;
    dynamicDatas: any[];
    required: boolean;
    requiredMessage: string;
    requiredMessageLangKey: string;
    reactions: {
      dependencies: {
        source: string;
        property: string;
        name: string;
        type: string;
      }[];
      fulfill: {
        state: {
          required: string;
          pattern: string;
          display: string;
          title: string;
          defaultValue: string;
          value: string;
        };
      };
    };
    validator: undefined | string | ValidatorInterface[];
    typeErrorMessage: string;
    typeErrorMessageLangKey: string;
  };
  componentProperties: {
    allowClear: boolean;
    labelInValue: boolean;
    showSearch: boolean;
    multiple: boolean;
    treeCheckable: boolean;
    treeDefaultExpandAll: boolean;
    dropdownMatchSelectWidth: boolean;
    treeCheckStrictly: boolean;
    showCheckedStrategy: string;
    treeDefaultExpandedKeys: string;
    treeNodeFilterProp: string;
    treeNodeLabelProp: string;
    filterTreeNode: {
      value: boolean | string;
      dataType: string;
    };
    treeDataSimpleMode: {
      value: boolean | string;
      dataType: string;
    };
    listHeight: number;
    maxTagCount: number | null;
    replaceField: { title: string; value: string; children: string; lang: string };
    size: string | undefined;
    placeholder: string;
    placeholderLangKey: string;
    searchPlaceholder: string;
    searchPlaceholderLangKey: string;
    onChange: string | undefined;
    onFocus: string | undefined;
    onBlur: string | undefined;
  };
  decoratorProperties: {
    tooltip: string;
    tooltipLangKey: string;
    labelWidth: string;
    wrapperWidth: string;
    labelAlign: string | undefined;
    wrapperAlign: string | undefined;
    hideLabel: boolean;
    colon: boolean;
    asterisk: boolean;
    labelCol: number | null;
    wrapperCol: number | null;
    customClass: string[];
  };
};

export type ValidatorInterface = {
  strategy: string;
  triggerType: string;
  driveList: string[];
  rangeRuleList: {
    fieldName: string;
    condition: string;
    target: number;
    unit: string;
    message: string;
    messageLangKey: string;
  }[];
  validator: string;
  message: string;
  messageLangKey: string;
  format: string;
  pattern: string;
  len: number | null;
  max: number | null;
  min: number | null;
  exclusiveMaximum: number | null;
  exclusiveMinimum: number | null;
  whitespace: boolean;
};

const TreeSelectModel: TreeSelectModel = {
  /**
   * 字段属性
   */
  fieldProperties: {
    /**
     * @name 控件类别
     * @description 控件的类别
     * @type {string}
     * @default 'input'
     */
    cate: 'input',
    /**
     * @name 控件类型
     * @description 控件的类型
     * @type {string}
     * @default 'treeSelect'
     */
    type: 'treeSelect',
    /**
     * @name 字段标识
     * @description 一般指对应数据库中的列名
     * @type {string}
     * @default ''
     */
    name: '',
    /**
     * @name 标题
     * @description 指显示控件的名称，如果配置了国际化标识，将读取指定的数据，否则此处将作为默认值
     * @type {string}
     * @default '下拉树'
     */
    title: '下拉树',
    /**
     * @name 标题国际化标识
     * @description 指多语言对应的key，不限制标识格式
     * @type {string}
     * @default ''
     */
    titleLangKey: '',
    /**
     * @name 描述
     * @description 指给字段进行简单描述或者备注
     * @type {string}
     * @default ''
     */
    description: '',
    /**
     * @name 描述国际化标识
     * @description 指多语言对应的key，不限制标识格式
     * @type {string}
     * @default ''
     */
    descriptionLangKey: '',
    /**
     * @name 展示状态
     * @description 字段展示状态分别为 显示--半隐藏(只会隐藏UI)--全隐藏(会删除数据)
     * @param {('visible', 'hidden', 'none')} - display 允许的显示方式
     * @default 'visible'
     */
    display: 'visible',
    /**
     * @name UI形态
     * @description 指一个UI所对应的操作属性 可编辑--禁用--只读--阅读
     * @param {('editable', 'disabled', 'readOnly', 'readPretty')} - pattern 允许的UI操作属性
     * @default 'editable'
     */
    pattern: 'editable',
    /**
     * @name 格式化函数
     * @description 阅读模式下数据格式化函数
     * @default ''
     */
    valueFormatter: '',
    /**
     * @name 默认值
     * @description 指控件初始值，数据类型为 string | string[]，在配置层表达式提供json字符串来表示，在应用层会将json字符串转换成实际数据类型
     * @param {('text', 'expression')} dataType
     * @default {value:'',dataType:'text'}
     */
    defaultValue: {
      value: '',
      dataType: 'text',
    },
    /**
     * @name 选项来源
     * @description 数据的来源，静态数据--动态数据
     * @param {('staticData', 'dynamicData')} dataSource
     * @type {string}
     * @default 'staticData'
     */
    dataSource: 'staticData',
    /**
     * @name 动态数据来源
     * @description 动态的数据来源，分为 数据源--JS变量--JS函数
     * @param {('api', 'var', 'function')} dynamicDataSource
     * @type {string}
     * @default 'api'
     */
    dynamicDataSource: 'api',
    /**
     * @name 静态数据
     * @description 选项来源为静态数据时，填写的静态数据JSON对象
     * @type {Array.<Object>}
     * @param {Object[]} staticDatas - 对象数据
     * @param {string} staticDatas[].label - 显示的标签名，此只是作为例子，不做限制key一定为label，如：可以设置为name
     * @param {string} staticDatas[].value - 存储的实际值，此只是作为例子，不做限制key一定为value，如：可以设置为id
     * @default []
     */
    staticDatas: [],
    /**
     * @name 数据源参数
     * @description 动态数据来源为数据源时，所需要的参数配置，key为API接口中心的选项唯一键，args为此api所需要的json参数，暂时不支持函数，后续扩展
     * @type {object}
     * @default {key:undefined,args:''}
     */
    apiParams: {
      key: undefined,
      args: '',
      callback: '(res) => {\n  return res.data;\n}',
    },
    /**
     * @name JS变量名
     * @description 此为动态数据来源为var时，在调用生成器时传递的本地js变量数据供生成器调用
     * @type {string}
     * @default ''
     */
    jsVar: '',
    /**
     * @name 函数名
     * @description 此为动态数据来源为function时，在调用生成器时传递的本地function函数名供生成器调用，支持异步回调
     * @type {string}
     * @default ''
     */
    functionName: '',
    /**
     * @name 动态数据载体
     * @description 此处为动态数据集装箱，由以上动态动作来返回
     * @type {Object[]}
     * @default []
     */
    dynamicDatas: [],
    /**
     * @name 必填
     * @description 字段是否必填，默认onBlur时校验
     * @default false
     */
    required: false,
    /**
     * @name 必填错误消息
     * @description 必填提示消息，如果未配置此属性，将默认提示规则：${title}不能为空
     * @type {string}
     * @default ''
     */
    requiredMessage: '',
    /**
     * @name 必填消息国际化标识
     * @description 指多语言对应的key，不限制标识格式
     * @type {string}
     * @default ''
     */
    requiredMessageLangKey: '',
    /**
     * @name 受控中心
     * @description 指配置各个组件的联动状态等
     */
    reactions: {
      dependencies: [
        {
          // 依赖的字段，值为字段所对应生成的hash值，此值是在拖拽进入表单中时所生成的值，此数据源需要一个path系统，值为一个对象树 eg: a.b.c
          source: '',
          // 依赖字段的属性，即指向的是字段属性
          property: 'value',
          // 变量名，默认由hash生成
          name: '',
          // 变量类型
          type: 'string',
        },
      ],
      fulfill: {
        // 当前字段属性受控于依赖字段的状态的表达式 eg: {{$deps.v_1jotl26gt2c === 'qita' ? 'Associated String Text' : ''}}
        state: {
          // 是否必填控制
          required: '',
          // UI形态控制
          pattern: '',
          // 展示状态控制
          display: '',
          // 标题
          title: '',
          // 默认值
          defaultValue: '',
          // 字段值
          value: '',
        },
      },
    },
    /**
     * @name 校验规则
     * @description 自定义校验规则，支持数据格式(通过正则表达式来实现，配置中会内置)，自定义函数，范围校验等
     * @type {('undefined', 'string' | Array.<Object>)} - 支持字符串或者对象数组类型，如果为字符串时，只能选择内置的数据格式校验(适合简单场景)，对象数组会相对复杂且包含了内置的数据格式校验(适合复杂场景)
     * @param {Object[]} validator - 自定义校验规则
     * @param {('self', 'drive', 'range')} validator[].strategy - 校验策略-----分别为自身校验--驱动校验--范围校验 @default 'self'
     * @param {('change', 'blur')} validator[].triggerType - 触发类型-----分别为改变时--失焦时 @default 'change'
     *
     * @description 以下配置适合用于 validator[].strategy == 'drive'的情况
     * @param {Array.<string>} validator[].driveList - 驱动校验字段-----驱动校验的字段列表，值为所对应的字段标识 @default []
     *
     * @description 以下配置适合用于 validator[].strategy == 'range'的情况
     * @param {object[]} validator[].rangeRuleList - 范围校验-----范围校验时需要的规则 @default []
     * @param {string} validator[].rangeRuleList[].fieldName - 字段名-----范围校验时所指定的字段名 @default ''
     * @param {('>', '<', '==', '>=', '<=', '!=', '-', '+', '%')} validator[].rangeRuleList[].condition - 字段条件-----范围校验时所指定的字段条件，分别为大于--小于--相等--大于等于--小于等于--不等--取差--求和--取模 @default ''
     * @param {number} validator[].rangeRuleList[].target - 目标值-----范围校验时所指定的目标值作为对比 @default null
     * @param {('default', 'minute', 'hour', 'day', 'week', 'month', 'years')} validator[].rangeRuleList[].unit - 单位-----目标值的单位，分别为默认(直接是对比数值大小)--分钟--小时--天--周--月--年 @default 'default'
     * @param {string} validator[].rangeRuleList[].message - 错误消息-----验证出错所需要的消息 @default ''
     * @param {string} validator[].rangeRuleList[].messageLangKey - 错误消息国际化标识-----指多语言对应的key，不限制标识格式 @default ''
     *
     * @description 以下配置适用于 validator[].strategy == 'self'的情况
     * @param {string} validator[].validator - 自定义校验器-----字符串类型的函数 @default ''
     * @param {string} validator[].message - 错误消息-----注：此错误消息在当前规则集中的一个内置规则生效，如需定制不同错误消息，请拆分多条规则 @default ''
     * @param {string} validator[].messageLangKey - 错误消息国际化标识-----指多语言对应的key，不限制标识格式 @default ''
     * @param {string} validator[].format - 格式校验-----数据格式的校验，跟validator为字符串时一样 @default undefined
     * @param {string} validator[].pattern - 正则表达式-----自定义的正则表达式的校验 @default ''
     * @param {number|null} validator[].len - 长度限制-----即字符或者数值的长度限制 @default null
     * @param {number|null} validator[].max - 长度/数值小于-----即字符的长度或者数值的值的最大值 @default null
     * @param {number|null} validator[].min - 长度/数值大于-----即字符的长度或者数值的值的最小值 @default null
     * @param {number|null} validator[].exclusiveMaximum - 长度/数值小于等于-----即字符的长度或者数值的值要小于等于指定值 @default null
     * @param {number|null} validator[].exclusiveMinimum - 长度/数值大于等于-----即字符的长度或者数值的值要大于等于指定值 @default null
     * @param {boolean} validator[].whitespace - 不允许有空格-----即字符中不允许出现空格 @default false
     * @default undefined
     */
    validator: undefined,
    /**
     * @name 类型错误消息
     * @description 类型错误消息
     * @type {string}
     * @default ''
     */
    typeErrorMessage: '',
    /**
     * @name 类型错误消息国际化标识
     * @description 指多语言对应的key，不限制标识格式
     * @type {string}
     * @default ''
     */
    typeErrorMessageLangKey: '',
  },
  /**
   * 组件属性
   */
  componentProperties: {
    /**
     * @name 允许清除内容
     * @type {boolean}
     * @default false
     */
    allowClear: false,
    /**
     * @name 标签值
     * @description 是否把每个选项的 label 包装到 value 中，会把 value 类型从 string 变为 {value: string, label: VNode } 的格式
     * @type {boolean}
     * @default false
     */
    labelInValue: false,
    /**
     * @name 支持搜索
     * @description 在下拉中显示搜索框(仅在单选模式下生效)
     * @type {boolean}
     * @default false
     */
    showSearch: false,
    /**
     * @name 开启多选
     * @description 当开启复选时，此自动开启
     * @type {boolean}
     * @default false
     */
    multiple: false,
    /**
     * @name 开启复选
     * @description 开启后，将出现checkbox选择，自动变成多选模式
     * @type {boolean}
     * @default false
     */
    treeCheckable: false,
    /**
     * @name 默认展开所有
     * @description 开启后，将展开全部树节点
     * @type {boolean}
     * @default false
     */
    treeDefaultExpandAll: false,
    /**
     * @name 下拉菜单和选择器同宽
     * @description 下拉菜单容器宽度与选择器宽度是否相同
     * @type {boolean}
     * @default true
     */
    dropdownMatchSelectWidth: true,
    /**
     * @name 完全受控
     * @description 多选状态下节点选择完全受控（父子节点选中状态不再关联），会使得 标签值(labelInValue) 强制为 开启状态，单选状态下无效
     * @type {boolean}
     * @default false
     */
    treeCheckStrictly: false,
    /**
     * @name 复选回显策略
     * @description 开启复选时，定义回显到控件的策略 显示所有--显示父节点--显示子节点
     * @param {('SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD')} showCheckedStrategy - 回显策略
     * @default 'SHOW_CHILD'
     */
    showCheckedStrategy: 'SHOW_CHILD',
    /**
     * @name 默认展开选项
     * @description 默认展开的选项key，格式：Array<string | number>，配置时，类型为string，在应用层会将string转成Array<string | number>
     * @type {string}
     * @default ''
     */
    treeDefaultExpandedKeys: '',
    /**
     * @name 节点过滤属性
     * @description 搜索时针对指定属性进行搜索
     * @type {string}
     * @default 'value'
     */
    treeNodeFilterProp: 'value',
    /**
     * @name 标签显示名称
     * @description 标签中显示的值所对应的key，组件使用的是treeData进行数据渲染，非TreeNode手动构造
     * @type {string}
     * @default 'title'
     */
    treeNodeLabelProp: 'title',
    /**
     * @name 节点过滤器
     * @description 是否根据输入项进行筛选，默认用 节点过滤属性 的值作为要筛选的 TreeNode 的属性值，若为表达式，格式为：(inputValue: string, treeNode: TreeNode) => boolean
     * @param {('boolean', 'expression')} dataType
     * @default {value:true,dataType:'boolean'}
     */
    filterTreeNode: {
      value: true,
      dataType: 'boolean',
    },
    /**
     * @name 使用简单数据结构
     * @description 使用简单格式的 treeData，通俗讲是下拉树数据源为一级数据结构的列表数据，但必须数据项之间一定要有父子关系，如pId，最终由组件递归转成树形结构数据，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: [{id:1, pId:0, value:'1', label:'test1',...},...], pId 是父节点的 id)，如果是表达式的配置方式，格式为：{ id: 'id', pId: 'pId' }，其实就是类似替换字段的功能，如果为布尔且为True，默认为{ id: 'id', pId: 'pId' }，此时可能需要修改自定义字段名的配置
     * @param {('boolean', 'expression')} dataType
     * @default {value:false,dataType:'boolean'}
     */
    treeDataSimpleMode: {
      value: false,
      dataType: 'boolean',
    },
    /**
     * @name 弹框滚动高度
     * @description 下拉框滚动区域高度
     * @type {number}
     * @default 256
     */
    listHeight: 256,
    /**
     * @name 最多标签个数
     * @description 最多显示多少个 tag
     * @type {number|null}
     * @default null
     */
    maxTagCount: null,
    /**
     * @name 自定义字段名
     * @description 此处为数据格式映射，为了统一各个UI库之间的数据格式以及支撑后端数据源格式
     * @type {object}
     * @default {title:'label',value:'value',children:'children',lang:'lang'}
     */
    replaceField: {
      title: 'label',
      value: 'value',
      children: 'children',
      lang: 'lang',
    },
    /**
     * @name 尺寸
     * @type {string|undefined}
     * @param {('large', 'default', 'small')} size - 允许的尺寸枚举值
     * @default undefined
     */
    size: undefined,
    /**
     * @name 占位提示
     * @type {string}
     * @default ''
     */
    placeholder: '',
    /**
     * @name 占位提示国际化标识
     * @type {string}
     * @default ''
     */
    placeholderLangKey: '',
    /**
     * @name 搜索占位提示
     * @type {string}
     * @default ''
     */
    searchPlaceholder: '',
    /**
     * @name 搜索占位提示国际化标识
     * @type {string}
     * @default ''
     */
    searchPlaceholderLangKey: '',
    /**
     * @name 改值动作
     * @description 输入框内容变化时的回调函数，函数来自formModel中的actions
     * @type {string|undefined}
     * @default undefined
     */
    onChange: undefined,
    /**
     * @name 获取焦点动作
     * @description 输入框获取焦点时的回调函数，函数来自formModel中的actions
     * @type {string|undefined}
     * @default undefined
     */
    onFocus: undefined,
    /**
     * @name 失去焦点动作
     * @description 输入框失去焦点时的回调函数，函数来自formModel中的actions
     * @type {string|undefined}
     * @default undefined
     */
    onBlur: undefined,
  },
  /**
   * 容器属性
   */
  decoratorProperties: {
    /**
     * @name 提示
     * @type {string}
     * @default ''
     */
    tooltip: '',
    /**
     * @name 提示国际化标识
     * @type {string}
     * @default ''
     */
    tooltipLangKey: '',
    /**
     * @name 标签宽度
     * @description 全局设置标签宽度，支持数值加单位 px、%、vh、em或者auto
     * @type {string}
     * @default 'auto'
     */
    labelWidth: 'auto',
    /**
     * @name 组件宽度
     * @description 全局设置组件宽度，支持数值加单位 px、%、vh、em或者auto
     * @type {string}
     * @default 'auto'
     */
    wrapperWidth: 'auto',
    /**
     * @name 标签栅格宽度
     * @description 采用24格栅格系统，与下面组件栅格宽度之和不能大于24，且标签宽度和组件宽度只要其中有一个不是auto，则栅格就不起作用
     * @type {number|null}
     * @default null
     */
    labelCol: null,
    /**
     * @name 组件栅格宽度
     * @description 采用24格栅格系统，与上面标签栅格宽度之和不能大于24，且标签宽度和组件宽度只要其中有一个不是auto，则栅格就不起作用
     * @type {number|null}
     * @default null
     */
    wrapperCol: null,
    /**
     * @name 标签对齐方式
     * @param {('right', 'left')} labelAlign - 允许的对齐方式
     * @type {string|undefined}
     * @default undefined
     */
    labelAlign: undefined,
    /**
     * @name 组件对齐方式
     * @param {('right', 'left')} wrapperAlign - 允许的对齐方式
     * @type {string|undefined}
     * @default undefined
     */
    wrapperAlign: undefined,
    /**
     * @name 是否隐藏标签
     * @description 表单控件可继承此属性
     * @type {boolean}
     * @default false
     */
    hideLabel: false,
    /**
     * @name 是否有冒号
     * @type {boolean}
     * @default true
     */
    colon: true,
    /**
     * @name 是否有星号
     * @type {boolean}
     * @default true
     */
    asterisk: false,
    /**
     * @name 自定义类名
     * @description 此className来自自定义style中的类名或者自己自定义
     * @type {Array.<string>}
     * @default []
     */
    customClass: [],
  },
};

export default TreeSelectModel;
