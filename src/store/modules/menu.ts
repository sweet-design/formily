import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import store from '@/store';
import uniq from 'lodash.uniq';

@Module({ namespaced: true, name: 'menu', dynamic: true, store })
export default class Menu extends VuexModule {
  private routes: string[] = []; // 缓存路由
  private status = true; // 当前是否需要切换重载
  private openKeys: string[] = []; // 打开的SubMenu菜单项
  private selectedKeys: string[] = []; // 当前选中的菜单项 key 数组

  /**
   * 获取缓存路由列表
   */
  get getRoutes() {
    return this.routes;
  }

  /**
   * 获取重载状态
   */
  get getStatus() {
    return this.status;
  }

  /**
   * 校验指定路由是否在缓存中
   */
  get check() {
    return (str: string): boolean => {
      return this.routes.includes(str);
    };
  }

  /**
   * 获取展开的SubMenu项列表
   */
  get getOpenKeys() {
    return this.openKeys;
  }

  /**
   * 获取当前选中的菜单列表
   */
  get getSelectedKeys() {
    return this.selectedKeys;
  }

  /**
   * 动态添加缓存路由
   * @param data 路由名称
   */
  @Mutation
  public add(data: string | string[]): void {
    if (Array.isArray(data)) {
      this.routes = uniq([...this.routes, ...data]);
    } else {
      const result = this.routes.includes(data);
      !result && this.routes.push(data);
    }
  }

  /**
   * 动态删除缓存路由
   * @param data 路由名称
   */
  @Mutation
  public delete(data: string | string[]): void {
    if (Array.isArray(data)) {
      this.routes = this.routes.filter(val => data.indexOf(val) === -1);
    } else {
      this.routes.splice(
        this.routes.findIndex(item => item === data),
        1,
      );
    }
  }

  /**
   * 更新重载状态
   */
  @Mutation
  public update(status: boolean): void {
    this.status = status;
  }

  /**
   * 更新展开的SubMenu的列表
   * @param data SubMenu菜单项编码列表
   */
  @Mutation
  public switchOpenKeys(data: string[]) {
    this.openKeys = data;
  }

  /**
   * 切换选中的路由name
   * @param data 路由name
   */
  @Mutation
  public switchSelectedKeys(data: string) {
    this.selectedKeys.splice(0, 1, data);
  }
}

export const MenuModule = getModule(Menu);
