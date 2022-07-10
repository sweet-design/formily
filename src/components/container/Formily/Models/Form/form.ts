export type FormModel = {
  labelWidth: string;
  wrapperWidth: string;
  labelAlign: string;
  wrapperAlign: string;
  layout: string;
  labelCol: number;
  wrapperCol: number;
  size: string;
  style: Record<string, any>;
  renderEngine: string;
  renderUI: string;
  customClass: string[];
  customStyle: string;
  clientEnv: string;
  actions: { key: string; name: string; body: string }[];
  apis: {
    key: string;
    name: string;
    url: string;
    method: string;
    auto: boolean;
    headers: { [key: string]: any };
    params: { [key: string]: any };
    requestInterceptor: string;
    responseInterceptor: string;
    error: string;
  }[];
  lifecycles: { key: string; name: string; body: string }[];
};

const formModel: FormModel = {
  /**
   * @name 标签栅格宽度
   * @description 采用24格栅格系统，与下面组件栅格宽度之和不能大于24，且标签宽度和组件宽度只要其中有一个不是auto，则栅格就不起作用
   * @type {number}
   * @default 6
   */
  labelCol: 6,
  /**
   * @name 组件栅格宽度
   * @description 采用24格栅格系统，与上面标签栅格宽度之和不能大于24，且标签宽度和组件宽度只要其中有一个不是auto，则栅格就不起作用
   * @type {number}
   * @default 18
   */
  wrapperCol: 18,
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
   * @name 标签对齐方式
   * @param {('right', 'left')} labelAlign - 允许的对齐方式
   * @type {string}
   * @default 'right'
   */
  labelAlign: 'right',
  /**
   * @name 组件对齐方式
   * @param {('right', 'left')} wrapperAlign - 允许的对齐方式
   * @type {string}
   * @default 'left'
   */
  wrapperAlign: 'left',
  /**
   * @name 布局方式
   * @description 水平--垂直--内联
   * @type {string}
   * @param {('horizontal', 'vertical', 'inline')} layout - 支持的布局方式
   */
  layout: 'horizontal',
  /**
   * @name 尺寸
   * @type {string}
   * @param {('large', 'default', 'small')} size - 允许的尺寸枚举值
   * @default 'default'
   */
  size: 'default',
  /**
   * @name 表单样式
   * @param {Object} style - 表单样式
   * @param {string} width - 表单宽度，全局设置表单宽度，支持数值加单位 px、%、vh、em或者auto
   * @param {string} height - 表单高度，全局设置表单高度，支持数值加单位 px、%、vh、em或者auto
   * @default {width:'auto',height:'auto'}
   */
  style: {
    width: 'auto',
    height: 'auto',
  },
  /**
   * @name 渲染引擎
   * @type {string}
   * @param {('vue2', 'vue3', 'react')} renderEngine - 渲染所使用的开源框架引擎
   * @default 'vue2'
   */
  renderEngine: 'vue2',
  /**
   * @name 渲染UI
   * @type {string}
   * @description 渲染控件所使用的UI库
   * @param {('ant-design-vue', 'vant2', 'vant3', 'antd')} renderUI - 渲染UI
   * @default 'ant-design-vue'
   */
  renderUI: 'ant-design-vue',
  /**
   * @name 自定义类名
   * @description 此className来自自定义style中的类名或者自己自定义
   * @type {Array.<string>}
   * @default []
   */
  customClass: [],
  /**
   * @name 自定义style
   * @description 支持 CSS Variable，注意此变量在IE下不支持
   * @type {string}
   * @default ''
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
   */
  customStyle: '',
  /**
   * @name 客户端环境
   * @type {string}
   * @param {('pc', 'mobile')} clientEnv - 客户端渲染环境
   * @default 'pc'
   */
  clientEnv: 'pc',
  /**
   * @name 动作响应中心
   * @param {Object[]} actions - 动作响应列表数据
   * @param {string} actions[].key - 动作响应唯一key，注：此key后续会作为执行动作时的调用名
   * @param {string} actions[].name - 动作响应名称，只作为显示
   * @param {string} actions[].body - 动作响应体内容
   * @default []
   */
  actions: [],
  /**
   * @name API接口中心
   * @param {Object[]} apis - API接口列表
   * @param {string} apis[].key - api所属唯一key
   * @param {string} apis[].name - api名称
   * @param {string} apis[].url - api地址
   * @param {('GET', 'POST', 'PATCH', 'PUT', 'DELETE')} apis[].method - api方法
   * @param {boolean} apis[].auto - 是否初始化时发送请求
   * @param {object} apis[].headers - 请求头信息
   * @param {object} apis[].params - 请求参数
   * @param {string} apis[].requestInterceptor - 请求拦截器
   * @param {string} apis[].responseInterceptor - 响应拦截器
   * @param {string} apis[].error - 请求错误处理
   */
  apis: [],
  /**
   * @name 表单生命周期
   * @description 表单生命周期动作列表
   * @param {Object[]} lifecycles - 生命周期列表
   * @param {string} lifecycles[].key - 周期函数唯一key，注：此key后续会作为执行动作时的调用名，不可修改
   * @param {string} lifecycles[].name - 周期函数名称，只作为显示，不可修改
   * @param {string} lifecycles[].body - 周期函数体内容，可修改
   */
  lifecycles: [
    {
      key: 'mounted',
      // 表单挂载后执行
      name: 'mounted',
      body: '',
    },
    {
      key: 'changed',
      // 改变后执行
      name: 'changed',
      body: '',
    },
    {
      key: 'reseted',
      // 重置后执行
      name: 'reseted',
      body: '',
    },
  ],
};

export default formModel;
