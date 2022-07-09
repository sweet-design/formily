import { basicComponents, layoutComponents, advanceComponents } from '../componentsConfig';

/**
 * 判断是否为对象
 * @param value 需要验证的值
 */
export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 对象深度合并，不支持数组，遇到数组替换
 * @param args[0] 目标源对象
 * @returns object 返回新对象
 */
export function merge(...args: Array<object>): object {
  const target: any = args[0];
  for (let i = 1; i < args.length; i++) {
    const source: any = args[i] || {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const value = source[key];
        if (isObject(value) && isObject(target[key])) {
          target[key] = merge(target[key], value);
        } else {
          target[key] = value;
        }
      }
    }
  }

  return target;
}

export function transformConfig(params: any) {
  const allComponentConfig = [...basicComponents, ...advanceComponents, ...layoutComponents];

  const data = JSON.parse(JSON.stringify(params));

  data.list.forEach((item: any) => {
    if (item.type === 'grid') {
      const obj: Record<string, any> =
        allComponentConfig.find(element => element.type === item.type) || {};
      const origin = JSON.parse(JSON.stringify(item));
      merge(item, obj, origin);

      item.columns.forEach((sub: any) => {
        sub.list.forEach((obj: any) => {
          const temp: Record<string, any> =
            allComponentConfig.find(element => element.type === obj.type) || {};
          const origin = JSON.parse(JSON.stringify(obj));
          merge(obj, temp, origin);
        });
      });
    } else {
      const obj: Record<string, any> =
        allComponentConfig.find(element => element.type === item.type) || {};
      const origin = JSON.parse(JSON.stringify(item));
      merge(item, obj, origin);
    }
  });

  return data;
}
