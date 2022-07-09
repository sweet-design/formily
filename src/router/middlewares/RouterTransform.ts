import { RouteConfig } from 'vue-router';

/**
 * 将路由配置数据拉平
 */
let datas: Array<RouteConfig> = [];

/**
 * 递归拉平
 * @param data 路由配置数据
 * @param path 路由相对地址
 */
const recursion = (data: Array<RouteConfig>, path: string) => {
  data.forEach(item => {
    if (item.nodeType === 'page') {
      const temp = { ...item, ...{ path: path + item.code } };
      if (item.children && item.children.length > 0) {
        const btns = item.children.map(ele => {
          return ele.code;
        });

        temp.extends = { ...item.children };
        temp.meta = { ...temp.meta, permissions: btns };
      }

      delete temp.children;

      datas.push(temp);
    }

    item.children &&
      item.children.length > 0 &&
      item.nodeType !== 'button' &&
      recursion(item.children, path + item.code + '/');
  });
};

const routerTransform = (data: RouteConfig): Array<RouteConfig> => {
  datas = [];
  recursion(data.children || [], '/');
  return datas;
};

export default routerTransform;
