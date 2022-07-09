import config from '@/config/default.config';
import xhr from './xhr';
import merge from 'lodash.merge';
import storage from '@/utils/storage';
import { AppModule } from '@/store/modules/app';

const common = () => ({
  baseConfig: {
    clientId: 'test',
    timestamp: Math.round((new Date() as any) / 1000),
  },
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTW9kZWwiOiJ7XCJVc2VySWRcIjo0NjkyMzk4NjA3OTc0MTc4NTMyLFwiQWNjb3VudElkXCI6NTA1NjkwNjgwNjE3NzE1MjA1NSxcIkxvZ2luTmFtZVwiOlwiU1dDMDA1NTBcIixcIlRlbmFudElkXCI6MCxcIlVzZXJUeXBlXCI6MCxcIkNvbXBJZFwiOjEwMDAwLFwiT3JnSWRcIjo1MzEyOTkxMzQyMTA0NjM1MjcwLFwiUG9zdElkXCI6MCxcIlJhbmtDb2RlXCI6XCJTTVwiLFwiTGFuZ1wiOm51bGx9IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlNXQzAwNTUwIiwianRpIjoiNDY5MjM5ODYwNzk3NDE3ODUzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwMjEvNC8yNyAxNjozNDo1MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlNNIiwibmJmIjoxNjE5NTA1MjkzLCJleHAiOjE2MTk1MTI0OTMsImlzcyI6IkNPSE8iLCJhdWQiOiJQZXJtaXNzaW9uIn0.NYgizumttymNf4z0-YLsE2IeYHxreJGb7pGvGGk9Ejw',
    'Accept-Language': AppModule.getLang,
  },
});

/**
 * get方式提交数据
 * @param data 传递数据
 */
const get = (data: AjaxRequestModel) => {
  if (data.params == null || Object.keys(data.params).length == 0) {
    data.body = common().baseConfig;
  } else {
    data.body = { ...common().baseConfig, ...data.params, ...{ sign: 'dsad8sdsadas7d98' } };
    delete data.params;
  }

  return xhr(data);
};

/**
 * form-body数据格式传递
 * @param data json数据
 */
const json = (data: AjaxRequestModel) => {
  const temp = JSON.parse(JSON.stringify(data));
  delete temp.body.method;
  const method = data.body.method;

  data.body = {
    ...common().baseConfig,
    ...{ data: temp.body, method: method, sign: 'dsad8sdsadas7d98' },
  };

  /* if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'mock') {
		data.body = data.body.data;
	} */

  if (process.env.NODE_ENV == 'mock') {
    data.body = data.body.data;
  }

  return xhr(data);
};

/**
 * 以表单数据格式传递
 * @param data 表单数据
 */
const form = (data: AjaxRequestModel) => {
  data = Object.assign(data, {
    body: Object.assign(common().baseConfig, data.params, {
      sign: 'dsad8sdsadas7d98',
    }),
    headers: Object.assign(common().headers, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  });

  delete data.params;

  return xhr(data);
};

/**
 * 带文件的表单提交
 * @param data 参数配置
 */
const formData = (data: any) => {
  data = merge(data, {
    headers: Object.assign(common().headers, { 'Content-Type': 'multipart/form-data' }),
  });

  const jsonData: any = {};
  data.params.forEach((value: any, key: any) => (jsonData[key] = value));

  data.body = Object.assign(jsonData, common().baseConfig);

  data.body.method = data.params.method;
  data.body.sign = 'dsad8sdsadas7d98';

  const formData = new FormData(); // 实例化表单对象
  for (const p in data.body) {
    formData.append(p, data.body[p]);
  }

  formData.append('data', data.file);

  data.data = formData;

  delete data.file;
  delete data.params;
  delete data.body;

  return xhr(data);
};

/**
 * 返回统一错误消息
 * @param msg 错误消息
 * @returns Promise
 */
const returnError = (msg: string): Promise<CommonAjaxReturnDataModel> => {
  return new Promise((resolve, reject) => {
    reject({ code: 500, msg: msg });
  });
};

export default async (options: AjaxRequestModel): Promise<CommonAjaxReturnDataModel> => {
  if (options.body) {
    options = { ...options, body: { busData: options.body } };
  }
  options = merge({ url: '', host: '', method: 'post', headers: common().headers }, options);

  const body = options.body && Object.keys(options.body).length > 0;
  const params = options.params && Object.keys(options.params).length > 0;

  if (body && (params || options.file)) return returnError('body参数与params或file不能同时存在');

  if (config.ajax.type === 2) {
    if (options.url === '') return returnError(`缺少方法名，eg: 'wts.hr.test.page'`);

    body ? (options.body.method = options.url) : (options.params.method = options.url);

    if (
      process.env.NODE_ENV == 'development' ||
      process.env.NODE_ENV == 'mock' ||
      process.env.NODE_ENV == 'sit'
    ) {
      options.url = '/' + options.url.split('.').join('/');
    } else {
      options.url = '';
    }
  }

  if (body) return json(options);

  if (options.method?.toLowerCase() == 'get') {
    return get(options);
  } else {
    if (options.file) {
      return formData(options);
    } else {
      return form(options);
    }
  }

  return new Promise((resolve, reject) => reject());
};
