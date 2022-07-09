import superAgent from 'superagent';
import httpErrorHandler from './httpErrorHandler';
import codeErrorHandler from './codeErrorHandler';

const xhr = ({
  url = '',
  body = {},
  method = 'post',
  headers = {},
  host = '',
  json = true,
  isFile = false,
  isBlob = false,
  onUploadProgress = (e: any) => {},
}): Promise<CommonAjaxReturnDataModel> => {
  url = url.replace(/\s+/g, ''); // 去掉首尾空格
  method = method.toLowerCase(); // method小写
  if (host == '') host = 'http://192.168.1.211:9099';

  let head = {};

  if (!isFile) {
    head = Object.assign(
      {
        'Content-Type': json
          ? 'application/json;charset=utf-8'
          : 'application/x-www-form-urlencoded;charset=utf-8',
      },
      headers,
    );
  } else {
    head = headers;
  }

  return new Promise((resolve, reject) => {
    const request = superAgent(method, host + url)
      .set(head)
      .accept('application/json, text/javascript, */*; q=0.01')
      .responseType(isBlob ? 'blob' : 'text');

    method === 'get' ? request.query(body) : request.send(body);

    if (isFile) {
      request.on('progress', (event: any) => {
        onUploadProgress(event);
      });
    }

    request.end((error: any, response: any) => {
      if (error) {
        httpErrorHandler(error);
        reject(error);
        return;
      }

      try {
        const body = response.body; // 服务器响应数据，应为标准response
        codeErrorHandler(response) === true ? resolve(body) : reject(body);
      } catch (err) {
        console.error(err);
      }
    });
  });
};
export default xhr;
