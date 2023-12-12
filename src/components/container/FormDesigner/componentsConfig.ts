export const basicComponents = [
  {
    type: 'input',
    name: 'pageDesign.fields.input',
    icon: 'icon-input',
    options: {
      /**
       * 是否自定义栅格
       */
      labelControl: false,
      labelCol: 6,
      width: '100%',
      /**
       * 是否受控
       */
      isControl: false,
      /**
       * 受控条件，字符串函数 eg: (obj: 表单对象) => { return 条件 }
       */
      controlCondition: '',
      defaultValue: '',
      required: false,
      dataType: 'string',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      pattern: '',
      placeholder: '请输入',
      disabled: false,
      onchange: '',
      /**
       * 字符格式化函数
       */
      valueFormatter: '',
    },
  },
  {
    type: 'textarea',
    name: 'pageDesign.fields.textarea',
    icon: 'icon-diy-com-textarea',
    options: {
      labelControl: false,
      labelCol: 6,
      width: '100%',
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      required: false,
      disabled: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      pattern: '',
      placeholder: '请输入',
      onchange: '',
      /**
       * 字符格式化函数
       */
      valueFormatter: '',
    },
  },
  {
    type: 'number',
    name: 'pageDesign.fields.number',
    icon: 'icon-number',
    options: {
      labelControl: false,
      labelCol: 6,
      width: '100%',
      isControl: false,
      controlCondition: '',
      required: false,
      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,
      precision: 0,
      disabled: false,
      controlsPosition: '',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 范围校验时，校验字段时所需要的信息
       */
      rangeRuleObj: {
        /**
         * 字段名
         */
        field: '',
        /**
         * 字段条件，1.大于(>) 2.小于(<) 3.相等(==) 4.大于等于(>=) 5.小于等于(<=) 6.不等(!=) 7.取差(-) 8.求和(+) 9.取模(%)
         */
        condition: '',
        /**
         * 目标值，即需要对比的目标值
         */
        target: 0,
        /**
         * 目标单位，1.默认(default) 2.分钟(minute) 3.小时(hour) 4.天(day) 5.年(years)
         */
        unit: 'default',
        /**
         * 错误信息
         */
        message: '',
      },
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      onchange: '',
    },
  },
  {
    type: 'radio',
    name: 'pageDesign.fields.radio',
    icon: 'icon-radio-active',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      inline: true,
      defaultValue: '',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      showLabel: true,
      options: [
        {
          value: 'Option1',
          label: '选项1',
        },
        {
          value: 'Option2',
          label: '选项2',
        },
        {
          value: 'Option3',
          label: '选项3',
        },
      ],
      required: false,
      width: '',
      /**
       * 数据是否来自服务器
       */
      remote: false,
      /**
       * 服务器数据
       */
      remoteOptions: [],
      /**
       * 服务端返回的数据 键值映射
       */
      props: {
        value: 'value',
        label: 'label',
      },
      /**
       * 获取服务器数据的方法
       */
      remoteFunc: '',
      disabled: false,
      onchange: '',
    },
  },
  {
    type: 'checkbox',
    name: 'pageDesign.fields.checkbox',
    icon: 'icon-check-box',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      inline: true,
      defaultValue: [],
      showLabel: true,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      options: [
        {
          value: 'Option1',
          label: '选项1',
        },
        {
          value: 'Option2',
          label: '选项2',
        },
        {
          value: 'Option3',
          label: '选项3',
        },
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
      remoteFunc: '',
      disabled: false,
      onchange: '',
    },
  },
  {
    type: 'time',
    name: 'pageDesign.fields.time',
    icon: 'icon-time',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      readonly: false,
      disabled: false,
      // editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 范围校验时，校验字段时所需要的信息
       */
      rangeRuleObj: {
        /**
         * 字段名
         */
        field: '',
        /**
         * 字段条件，1.大于(>) 2.小于(<) 3.相等(==) 4.大于等于(>=) 5.小于等于(<=) 6.不等(!=) 7.取差(-) 8.求和(+) 9.取模(%)
         */
        condition: '',
        /**
         * 目标值，即需要对比的目标值
         */
        target: 0,
        /**
         * 目标单位，1.默认(default) 2.分钟(minute) 3.小时(hour) 4.天(day) 5.年(years)
         */
        unit: 'default',
        /**
         * 错误信息
         */
        message: '',
      },
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      isRange: false,
      // arrowControl: true,
      format: 'HH:mm:ss',
      hourStep: 1,
      minuteStep: 1,
      secondStep: 1,
      required: false,
      width: '100%',
      onchange: '',
    },
  },
  {
    type: 'date',
    name: 'pageDesign.fields.date',
    icon: 'icon-date',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      readonly: false,
      disabled: false,
      // editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 范围校验时，校验字段时所需要的信息
       */
      rangeRuleObj: {
        /**
         * 字段名
         */
        field: '',
        /**
         * 字段条件，1.大于(>) 2.小于(<) 3.相等(==) 4.大于等于(>=) 5.小于等于(<=) 6.不等(!=) 7.取差(-) 8.求和(+) 9.取模(%)
         */
        condition: '',
        /**
         * 目标值，即需要对比的目标值
         */
        target: 0,
        /**
         * 目标单位，1.默认(default) 2.分钟(minute) 3.小时(hour) 4.天(day) 5.年(years)
         */
        unit: 'default',
        /**
         * 错误信息
         */
        message: '',
      },
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      format: 'YYYY-MM-DD',
      // timestamp: false,
      hourStep: 1,
      minuteStep: 1,
      secondStep: 1,
      required: false,
      width: '100%',
      onchange: '',
    },
  },
  {
    type: 'rate',
    name: 'pageDesign.fields.rate',
    icon: 'icon-pingfen1',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: null,
      max: 5,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      disabled: false,
      allowHalf: false,
      required: false,
      onchange: '',
    },
  },
  {
    type: 'color',
    name: 'pageDesign.fields.color',
    icon: 'icon-color',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      disabled: false,
      showAlpha: false,
      required: false,
      onchange: '',
    },
  },
  {
    type: 'treeSelect',
    name: 'pageDesign.fields.treeselect',
    icon: 'icon-select',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      /**
       * 辅助字段
       */
      assistField: '',
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      asyncLoad: false,
      width: '100%',
      filterable: false,
      showCheckedStrategy: 'SHOW_CHILD',
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      remoteFunc: '',
      onchange: '',
    },
  },
  {
    type: 'select',
    name: 'pageDesign.fields.select',
    icon: 'icon-select',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      showLabel: true,
      width: '100%',
      options: [
        {
          value: 'Option1',
          label: '选项1',
        },
        {
          value: 'Option2',
          label: '选项2',
        },
        {
          value: 'Option3',
          label: '选项3',
        },
      ],
      remote: false,
      filterable: false,
      filterfetch: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
      remoteFunc: '',
      onchange: '',
    },
  },
  {
    type: 'ddList',
    name: 'pageDesign.fields.ddlist',
    icon: 'icon-select',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: [],
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      width: '100%',
      searchType: 'HrEmp',
      // 查询参数
      searchParams: '',
      autoSearch: false,
      filterfetch: false,
      remote: true,
      props: {
        value: 'value',
        label: 'label',
      },
      options: [],
      remoteFunc: '',
      count: 10,
      onchange: '',
    },
  },
  {
    type: 'customSelector',
    name: 'pageDesign.fields.customselector',
    icon: '',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      // 选择器类型 1.人员选择器 2.下拉列表选择器 3.列表选择器 4.弹出树选择器
      type: 'user-selector',
      multiple: false,
      disabled: false,
      clearable: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      placeholder: '',
      required: false,
      width: '100%',
      onchange: '',
    },
  },
  {
    type: 'switch',
    name: 'pageDesign.fields.switch',
    icon: 'icon-switch',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: false,
      required: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      disabled: false,
      onchange: '',
    },
  },
  {
    type: 'button',
    name: 'pageDesign.fields.button',
    title: '按钮',
    icon: '',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      // 是否内联
      inline: true,
      // 浮动方向
      float: 'left',
      // 水平对齐方式
      justify: 'left',
      controlCondition: '',
      type: 'primary',
      icon: '',
      handleEvent: '',
      // 是否是按钮组
      group: false,
      groupList: [
        {
          title: '默认',
          icon: 'appstore',
          handleEvent: '',
        },
      ],
      disabled: false,
      customStyle: '',
    },
  },
  {
    type: 'slider',
    name: 'pageDesign.fields.slider',
    icon: 'icon-slider',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      showInput: false,
      range: false,
      width: '',
    },
  },
  {
    type: 'text',
    name: 'pageDesign.fields.text',
    icon: 'icon-wenzishezhi-',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '默认文本',
      customClass: '',
      onchange: '',
      /**
       * 字符格式化函数
       */
      valueFormatter: '',
    },
  },
  {
    type: 'html',
    name: 'Html',
    icon: '',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '<div>标题</div>',
      customClass: '',
      remote: true,
      remoteFunc: '',
      remoteOptions: [],
    },
  },
];

export const advanceComponents = [
  {
    type: 'blank',
    name: 'pageDesign.fields.blank',
    icon: 'icon-zidingyishuju',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultType: 'String',
    },
  },
  {
    type: 'imgupload',
    name: 'pageDesign.fields.fileUpload',
    icon: 'icon-tupian',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      // 默认已经上传的文件数据
      defaultValue: [],
      // size: {
      // 	width: 100,
      // 	height: 100
      // },
      width: '',
      // 获取token时使用的方法
      tokenFunc: 'funcGetToken',
      // token 数据
      token: '',
      // 阿里云上传时的地址
      domain: 'http://pfp81ptt6.bkt.clouddn.com/',
      // 是否禁用
      disabled: false,
      // 最大上传数量
      length: 3,
      // 是否支持多选
      multiple: false,
      // 是否支持相机拍照上传
      isCamera: true,
      // 是否支持使用相册上传
      isAlbum: true,
      // 是否使用阿里云上传
      isAliyun: false,
      // 是否支持删除
      isDelete: true,
      // 最大上传文件大小，单位M
      maxSize: 20,
      // 附件别名
      alise: '上传附件',
      required: false,
      // 最小显示文件数量，比如小于此值，不可再删除
      // min: 0,
      // 是否支持编辑
      // isEdit: false,
      // 上传地址
      action: '/wtspro-storage/storage/fileUpload',
      // 上传文件类型
      accept: '.jpg,.png,.jpeg',
      // 上传附件所属模块
      module: 'hr',
      onchange: '',
      // 附件示例
      fileExample: [],
    },
  },
  {
    type: 'editor',
    name: 'pageDesign.fields.editor',
    icon: 'icon-fuwenbenkuang',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: '',
      width: '',
    },
  },
  {
    type: 'cascader',
    name: 'pageDesign.fields.cascader',
    icon: 'icon-jilianxuanze',
    options: {
      labelControl: false,
      labelCol: 6,
      isControl: false,
      controlCondition: '',
      defaultValue: [],
      width: '',
      placeholder: '',
      required: false,
      disabled: false,
      /**
       * 高级校验类型, 0.不校验 1.驱动校验 2.范围校验 3.自定义校验
       */
      advanceRuleType: '',
      /**
       * 驱动校验的字段列表
       */
      driveList: [],
      /**
       * 自定义校验时的函数
       */
      customRuleFunc: '',
      clearable: false,
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      remoteFunc: '',
      onchange: '',
      /**
       * 辅助字段
       */
      assistField: '',
    },
  },
  {
    type: 'table',
    name: 'pageDesign.fields.table',
    icon: '',
    // 是否显示边框
    border: true,
    // 是否显示分页
    page: false,
    // 分页配置
    pagination: {
      position: 'bottom',
      total: 10,
    },
    // 是否显示选择列
    showSelectCol: false,
    // 选择列的配置，目前内置了onChange 后续继续扩展选择列配置
    rowSelection: {
      // 选项发生变化后的回调函数，目前是内置，不过需要在配置时需要配函数体
      onChange: '',
    },
    // 数据行唯一标识字段
    primaryKey: 'id',
    // 大小
    size: 'default',
    // 表格类型, 1.默认表格，列表树，嵌套表格
    tableType: 'default',
    // 加载模式 1.全部加载，2.懒加载(只在列表数或者嵌套表格中支持)
    loadMode: 'all',
    // 高度
    height: 0,
    // 宽度
    width: 0,
    // 其他选项
    options: {
      required: false,
    },
    // 列配置项
    columns: [
      {
        // 列类型 1.数据列 data 2.模板列 template 3.操作列 opration
        type: 'data',
        // 列对齐方式
        align: 'left',
        // 是否自动省略超出内容
        ellipsis: false,
        // 字段标识
        dataIndex: '',
        // 是否支持筛选
        isFilter: false,
        // 筛选时是否支持多选
        filterMultiple: false,
        // 筛选时的静态数据选项
        options: [
          {
            value: 'Option1',
            text: '选项1',
          },
          {
            value: 'Option2',
            text: '选项2',
          },
          {
            value: 'Option3',
            text: '选项3',
          },
        ],
        // 筛选的默认值
        defaultValue: '',
        // 是否显示lable
        showLabel: true,
        // 数据是否来自服务器
        remote: false,
        // 服务器数据
        remoteOptions: [],
        // 服务端返回的数据 键值映射
        props: {
          value: 'value',
          text: 'text',
        },
        // 获取服务器数据的方法
        remoteFunc: '',
        // 排序方式, 0.default 不排序 1.server 服务端排序 2.local 本地排序
        sorterType: 'default',
        // 如果是本地排序，需填写排序函数
        sorterFunc: '',
        // 列固定位置 1.none 不固定 2.left 固定在左侧 3.right 固定在右侧
        fixed: '',
        // 标题
        title: '字段名称',
        // 宽度
        width: '',
      },
    ],
  },
];

export const layoutComponents = [
  {
    type: 'grid',
    name: 'pageDesign.fields.grid',
    icon: 'icon-grid-',
    /**
     * 布局数据
     */
    columns: [
      {
        span: 12,
        /**
         * 表单组件对象清单
         */
        list: [],
      },
      {
        span: 12,
        list: [],
      },
    ],
    /**
     * 布局配置
     */
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
    },
  },
];
