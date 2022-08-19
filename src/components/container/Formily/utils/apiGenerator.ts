import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { isObject, merge } from 'lodash';

const tranform = (data: any[]) => {
  return data.reduce((a, b) => {
    return (a[b.key] = b.value), a;
  }, {});
};

const tranformObj = (data: any[]) => {
  return data.reduce((a, b) => {
    try {
      const result = JSON.parse(b.value);

      if (isObject(result)) {
        return (a[b.key] = result), a;
      }
    } catch (e) {
      // message.error((e as any).message);
    }

    return (a[b.key] = b.value), a;
  }, {});
};

/**
 * 生成指定api接口
 * @param item 当前api接口配置信息
 * @param data api所需要的自定义参数，会深度合并
 * @returns {Promise} 请求所返回的数据
 */
export const singleApiGenerator = (item: any, data?: any): Promise<any> => {
  const body = tranformObj(item.body);

  // 实例化请求实例
  const service = axios.create({
    method: item.method,
    headers: tranform(item.headers),
  });

  // 请求拦截器
  service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (item.requestInterceptor.trim() !== '') {
        return Function(
          '"use strict";return (' + `(config) => { ${item.requestInterceptor} }` + ')',
        )()(config);
      }

      return config;
    },
    (error: any) => {
      if (item.error.trim() !== '') {
        return Function('"use strict";return (' + `(error) => { ${item.error} }` + ')')()(error);
      }

      message.error('请求错误');

      return Promise.reject(error);
    },
  );

  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      if (item.responseInterceptor.trim() !== '') {
        return Function(
          '"use strict";return (' + `(response) => { ${item.responseInterceptor} }` + ')',
        )()(response);
      }

      return response;
    },
    (error: any) => {
      if (item.error.trim() !== '') {
        return Function('"use strict";return (' + `(error) => { ${item.error} }` + ')')()(error);
      }

      message.error('响应错误');

      return Promise.reject(error);
    },
  );

  if (isObject(data)) {
    merge(body, data);
  }

  return service({ url: item.url, params: tranform(item.params), data: body });
};

export default (data: any[]) => {
  const apis: any = {};

  data.forEach((item: any) => {
    apis[item.key] = (data?: any) => {
      return singleApiGenerator(item, data);
    };
  });

  return apis;
};
