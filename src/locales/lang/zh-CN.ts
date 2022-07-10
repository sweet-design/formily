import antdZhCN from 'ant-design-vue/es/locale-provider/zh_CN';
import momentZhCN from 'moment/locale/zh-cn';

import global from './zh-CN/global';
import menu from './zh-CN/menu';

import form from './zh-CN/form';

import pageDesigner from './zh-CN/designer';
import formily from './zh-CN/formily';

const components = {
  antLocale: antdZhCN,
  momentName: 'zh-cn',
  momentLocale: momentZhCN,
};

export default {
  message: '-',
  ...components,
  ...global,
  ...menu,
  ...form,
  ...pageDesigner,
  ...formily,
};
