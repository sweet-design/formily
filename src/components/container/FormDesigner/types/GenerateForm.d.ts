import { CohoComponent } from './component';

export declare class GenerateForm extends CohoComponent {
  /**
   * JSON配置数据
   */
  data: Record<string, any>;
  /**
   * 过滤表单项
   */
  filterKeys: Array<string>;
  /**
   * json表单数据对象
   */
  value?: Record<string, any>;
  /**
   * 远端方法对象
   */
  remote?: Record<string, any>;
  /**
   * 插件列表
   */
  plugins?: Record<string, any>;
  /**
   * 获取表单数据
   * @param state 获取表单数据时是否需要先校验 默认true
   */
  getData(state?: boolean): Promise;
  /**
   * 获取表单是否被修改过
   */
  getFormState(): boolean;
  /**
   * 获取表单项vue实例对象
   * @param key 表单key
   */
  getFormItemInstance(key: string): any;
  /**
   * 重置表单数据
   */
  reset(): void;
  /**
   * 移除表单项的校验结果，传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
   */
  clear(props?: Array<string> | string): void;
}
