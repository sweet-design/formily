export type ArrayTableModel = {
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
  };
  componentProperties: {
    bordered: boolean;
    showHeader: boolean;
    size: string | undefined;
    tableLayout: string;
    list: ColConfigModel[];
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

export type ColConfigModel = {
  fieldProperties: {
    name: string;
    title: string;
    titleLangKey: string;
    description: string;
    descriptionLangKey: string;
    display: string;
    pattern: string;
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
    isContainerComponent: boolean;
  };
  componentProperties: {
    title: string;
    titleLangKey: string;
    align: string;
    width: number | null;
    fixed: string | boolean;
    colType: string;
    list: any[];
  };
};

export const ColModel: ColConfigModel = {
  fieldProperties: {
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
     * @default 'Title'
     */
    title: 'Title',
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
     * @name 容器组件
     * @description 此列是否是容器组件，若是，将启用此列的标识字段作为数据节点来包装，若不是，将废弃此标识字段，直接读取列中的子元素
     * @default false
     */
    isContainerComponent: false,
  },
  componentProperties: {
    /**
     * @name 标题
     * @description 指显示列标题，如果配置了国际化标识，将读取指定的数据，否则此处将作为默认值
     * @type {string}
     * @default 'Title'
     */
    title: 'Title',
    /**
     * @name 标题国际化标识
     * @description 指多语言对应的key，不限制标识格式
     * @type {string}
     * @default ''
     */
    titleLangKey: '',
    /**
     * @name 内容对齐
     * @description 指列内容对齐方式
     * @param {('left', 'center', 'right')} - align 允许的对齐方式
     * @type {string}
     * @default 'left'
     */
    align: 'left',
    /**
     * @name 列宽度
     * @description 指列宽度
     * @type {null|number}
     * @default null
     */
    width: null,
    /**
     * @name 固定
     * @description 列固定位置
     * @param {('left', 'center', false)} - fixed 允许的固定方式
     * @default false
     */
    fixed: false,
    /**
     * @name 列类型
     * @description 列类型：索引列---操作列---数据列
     * @param {('index', 'opt', 'data')} - colType 允许的列的类型
     */
    colType: 'data',
    /**
     * @name 控件项
     */
    list: [],
  },
};

const ArrayTableModel: ArrayTableModel = {
  /**
   * 字段属性
   */
  fieldProperties: {
    /**
     * @name 控件类别
     * @description 控件的类别
     * @type {string}
     * @default 'array'
     */
    cate: 'array',
    /**
     * @name 控件类型
     * @description 控件的类型
     * @type {string}
     * @default 'arrayTable'
     */
    type: 'arrayTable',
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
     * @default '自增表格'
     */
    title: '自增表格',
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
     * @description 指控件初始值，expression 比较特殊，值为JSON字符串来支持复杂数据格式
     * @param {('expression')} dataType
     * @default {value:'',dataType:'text'}
     */
    defaultValue: {
      value: '',
      dataType: 'expression',
    },
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
  },
  /**
   * 组件属性
   */
  componentProperties: {
    /**
     * @name 是否有边框
     * @type {boolean}
     * @description 是否展示外边框和列边框
     * @default true
     */
    bordered: true,
    /**
     * @name 显示头部
     * @description 是否显示表头
     * @type {boolean}
     * @default true
     */
    showHeader: true,
    /**
     * @name 尺寸
     * @type {string|undefined}
     * @param {('default', 'middle', 'small')} size - 允许的尺寸枚举值
     * @default undefined
     */
    size: undefined,
    /**
     * @name 表格布局
     * @type {string}
     * @param {('auto', 'fixed')} tableLayout - 允许的表格布局设置
     * @default 'auto'
     */
    tableLayout: 'auto',
    /**
     * @name 列的列表数据
     */
    list: [],
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

export default ArrayTableModel;
