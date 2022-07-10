import Vue from 'vue';
import VueRouter from 'vue-router';
import hooks from './hooks';
import { baseRouterMap, asyncRouterMap } from './maps';
import mapping from './middlewares/Mapping';
import storage from '@/utils/storage';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err);
};

if (storage.get('ROUTER_DATA')) {
  asyncRouterMap[0].children = [...(asyncRouterMap[0].children || []), ...mapping()];
}

const router = new VueRouter({
  mode: 'history',
  base: window.__POWERED_BY_QIANKUN__ ? '/ant-vue-pc' : process.env.BASE_URL,
  routes: [...baseRouterMap, ...asyncRouterMap],
});

hooks(router);

export default router;
