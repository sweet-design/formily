import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import store from '@/store';

@Module({ namespaced: true, name: 'queue' })
export default class Queue extends VuexModule {
  private list: string[] = ['嘿嘿']; // 缓存路由

  /**
   * 获取缓存路由列表
   */
  get getRoutes() {
    return this.list;
  }

  @Mutation
  public add(status: string): void {
    this.list.push(status);
  }
}

export const QueueModule = () => getModule(Queue, store);
