import AutoImport from './AutoImport';
import RouterTransform from './RouterTransform';
import { MenuModule } from '@/store/modules/menu';
import config from '@/config/default.config';
import storage from '@/utils/storage';

export default () => {
  // 获取缓存中的路由权限数据
  const routerData = storage.get('ROUTER_DATA');
  // 拉平视图
  const routes = RouterTransform(routerData);
  // 配置数据与内部数据合并
  const routerList = routes.map(item => {
    let current: any = AutoImport.find(sub => sub.code === item.code);

    if (config.multiTab || item.meta.keepAlive) {
      MenuModule.add(item.code || '');
      // 如果视图启用缓存，将视图放入缓存队列
      /* if (!current) {
				const fileName = item.path.split('/').slice(-2, -1)[0];
				MenuModule.add(fileName || '');
			} else {
				MenuModule.add(item.code || '');
			} */
    }

    if (!current) {
      // const fileName = item.path.split('/').slice(-2, -1)[0];
      current = {
        component: () => import(`@/views/common/${item.type}`),
      };
    }

    return { ...item, ...current };
  });

  return routerList;
};
