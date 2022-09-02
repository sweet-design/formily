import { executeStr } from '../utils/format';

export default async (config: Record<string, any>, apis: Record<string, any>) => {
  const fieldProperties = config.fieldProperties;

  if (fieldProperties.dynamicDataSource === 'api') {
    // 请求数据
    if (fieldProperties.apiParams.key) {
      // 自定义参数
      let objs = null;

      if (fieldProperties.apiParams.args.trim() !== '') {
        objs = executeStr(fieldProperties.apiParams.args);
      }

      const res = await apis[fieldProperties.apiParams.key](objs);

      return new Promise((resolve, reject) => {
        if (fieldProperties.apiParams.callback.trim() !== '') {
          const func = Function(
            '"use strict";return (' + fieldProperties.apiParams.callback.trim() + ')',
          )();

          resolve(func(res.data));
        } else {
          resolve(res.data);
        }
      });
    }
  }
};

export const fetchData = async (
  config: { key: string | undefined; args: string; callback: string },
  apis: Record<string, any>,
  ...agrs: any[]
) => {
  if (config.key) {
    // 自定义参数
    let objs = null;

    if (config.args.trim() !== '') {
      objs = executeStr(config.args, ...agrs);
    }

    const res = await apis[config.key](objs);

    return new Promise((resolve, reject) => {
      if (config.callback.trim() !== '') {
        const func = Function('"use strict";return (' + config.callback.trim() + ')')();

        resolve(func(res.data));
      } else {
        resolve(res.data);
      }
    });
  }
};
