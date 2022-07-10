import xhr from './service';
/**
 * XHR 请求接口定义
 * @param  {String} options.method 请求方法，默认为 post
 * @param  {String} options.url    请求路径，默认空字符串
 * @param  {Object} options.data   post方式下的请求体，默认 null
 * @param  {Object} options.params   get方式下的请求体，默认 null
 * @param  {Object} options.headers 自定义请求头，一般不用填
 * @param  {String} options.baseURL 请求域名，默认读取全局变量
 * @return {Promise}
 * 使用例子 xhr({ method: 'post', url: 'XXX', data: {Object}, headers:{Object}, baseURL: "http://192.168.1.181:1234567/" })
 */
export default xhr;
