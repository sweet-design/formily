import VueRouter from 'vue-router';

type Metas = {
  title: string;
  requiresAuth: boolean;
  icon: string;
  keepAlive: boolean;
};

/**
 * 扩展vue-router 基础配置选项
 */
declare module 'vue-router/types/router' {
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  interface _RouteConfigBase {
    id?: string;
    code?: string;
    nodeType?: string;
    type?: string;
    meta: Metas;
    extends?: any;
  }
}
