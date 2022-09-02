/**
 * filter classname of css code
 * @param {string} str - css code
 * @returns {Array<string>} - classname list
 */
export const getExecStrs = (str: string): string[] => {
  const reg = /\.(.+?)\s/g;
  const list = [];
  let result = null;

  do {
    result = reg.exec(str);
    result && list.push(result[1]);
  } while (result);

  return list;
};

/**
 * create hash value
 * @param hashLength - hash langth
 * @returns {string} - hash value
 */
export const createHash = (hashLength = 24): string => {
  return Array.from(Array(Number(hashLength) || 24), () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join('');
};

/**
 * 根据配置数据生成组件列表数据
 * @param data 根级别的组件配置数据
 * @param filterNode 需要过滤的组件节点唯一编号集合
 */
export const generateComponentList = (data: any, filterNode: string[]) => {
  const arr: any[] = [];

  data.list.forEach((item: any) => {
    if (item.fieldProperties.type === 'grid') {
      item.componentProperties.columns.forEach((element: any) => {
        element.list.forEach((sub: any) => {
          if (!filterNode.includes(sub.key)) {
            arr.push({
              value: sub.key,
              key: sub.key,
              title: sub.fieldProperties.title,
            });
          }
        });
      });
    } else {
      if (!filterNode.includes(item.key)) {
        arr.push({
          value: item.key,
          key: item.key,
          label: item.fieldProperties.title,
          title: item.fieldProperties.title,
        });
      }
    }
  });

  return arr;
};

/**
 * function executor
 * @param {string} obj - function code
 * @returns {boolean} - return state
 */
export const executeStr = (obj: string, ...agrs: any[]): boolean => {
  return Function('"use strict";return (' + obj + ')')()(...agrs);
};

/**
 * 判断是否是json字符串
 * @param str 字符串
 * @returns {boolean} 是否为json字符串
 */
export const isJSON = (str: string): boolean => {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  return false;
};
