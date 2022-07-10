import xhr from './superAgent';
/**
 * XHR 请求接口定义
 * @param  {String} options.method 请求方法，默认为 post
 * @param  {String} options.url    请求路径，默认空字符串
 * @param  {Object} options.body   请求体，默认 {}
 * @param  {Object} options.headers 自定义请求头，一般不用填
 * @param  {String} options.host 请求域名，默认读取全局变量
 * @param  {Boolean} options.json 是否以json格式传递，默认true
 * @return {Promise}
 * 使用例子 xhr({ method: 'post', url: 'XXX', body: {Object}, headers:{Object}, host: "http://192.168.1.181:1234567/", json: true })
 */
export default xhr;
