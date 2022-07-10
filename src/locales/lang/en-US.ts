import antdEnUS from 'ant-design-vue/es/locale-provider/en_US';
import momentEU from 'moment/locale/eu';

import global from './en-US/global';
import menu from './en-US/menu';

import form from './en-US/form';

import pageDesigner from './en-US/designer';

import formily from './en-US/formily';

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU,
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
