import { RouteConfig } from 'vue-router';

/**
 * 系统基本路由
 */
export const baseRouterMap: Array<RouteConfig> = [
  {
    path: '/user/login',
    code: 'Login',
    name: 'Login',
    meta: { title: '登录', requiresAuth: false, icon: '', keepAlive: false },
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
  },
  {
    path: '/config/page-designer',
    code: 'PageDesigner',
    name: 'PageDesigner',
    meta: { title: '页面设计', requiresAuth: false, icon: '', keepAlive: false },
    component: () => import(/* webpackChunkName: "user" */ '@/views/config/PageDesigner'),
  },
  {
    path: '/config/form-designer-new',
    code: 'FormDesignerNew',
    name: 'FormDesignerNew',
    meta: { title: '页面设计', requiresAuth: false, icon: '', keepAlive: false },
    component: () => import(/* webpackChunkName: "user" */ '@/views/config/FormDesigner'),
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
  },
];

/**
 * 系统框架层路由
 */
export const asyncRouterMap: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/framework/index'),
    meta: { title: '主页', requiresAuth: false, icon: '', keepAlive: true },
    children: [],
  },
];
