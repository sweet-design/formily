import { message } from 'ant-design-vue';

/**
 * @param {data} 服务器返回的数据
 * @returns {boolean} 返回布尔值
 */
export default (data: any): boolean => {
  if (data.req._responseType == 'blob') return true;

  if (!data.body) {
    console.error('服务器返回的数据无法解析', data.body);
    return false;
  }

  // 此情况不是标准数据结构，服务器可能没有返回状态码，此时可放行
  if (data.body && data.body.code == undefined) {
    return true;
  }

  /* 判断服务器返回的状态码 */
  switch (parseInt(data.body.code)) {
    case 200:
      data.body.msg = '处理成功';
      // message.success(data.body.msg);
      return true;
    default:
      console.error(data.body);
      return true;
  }
};
