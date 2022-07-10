interface Window {
  umi_plugin_ant_themeVar: any;
  /**
   * 是否以微服务启动
   */
  __POWERED_BY_QIANKUN__: boolean;
}

/**
 * 全局ajax请求参数模型
 */
declare interface AjaxRequestModel {
  /**
   * 请求url，此配置有两种模式，一种是常规模式，一种是网关模式，如果是常规模式，url为网关对应的方法，如：wts.hr.test.page 分别为：应用系统/模块名/控制器名/action名
   */
  url: string;
  /**
   * 请求host，默认读取网关地址，在环境变量中定义
   */
  host?: string;
  /**
   * 请求方式，支持post，get，delete，put，默认post
   */
  method?: string;
  /**
   * 请求头信息
   */
  headers?: object;
  /**
   * 请求参数，在请求方式为get或者请求数据类型为form或者form-data的情况下，请将数据填写在这里
   */
  params?: any;
  /**
   * 请求文件，此参数为上传文件时使用
   */
  file?: Blob;
  /**
   * 请求体数据，请求方式为post时使用，在此填写数据
   */
  body?: any;
  /**
   * 响应类型是否是二进制文件
   */
  isBlob?: boolean;
  /**
   * 上传进度
   */
  onUploadProgress?: (e: any) => void;
}

/**
 * ajax请求返回的数据模型
 */
declare interface CommonAjaxReturnDataModel {
  /**
   * 业务状态码
   */
  code: number;
  /**
   * 业务处理返回的消息
   */
  msg: string;
  /**
   * 业务返回的数据
   */
  data?: any;
}
