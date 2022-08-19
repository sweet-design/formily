import { message } from 'ant-design-vue';

type ActionModel = {
  key: string;
  name: string;
  body: string;
};

/**
 * @name 生成动作响应中心数据
 */
export default (data: ActionModel[]) => {
  const actions: any = {};

  data.forEach(item => {
    try {
      actions[item.key] = Function('"use strict";return (' + `(data) => { ${item.body} }` + ')')();
    } catch (e) {
      message.error((e as any).message);
    }
  });

  return actions;
};
