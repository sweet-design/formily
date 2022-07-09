import nprogress from '@/utils/nprogress';
import ScrollPosition from '@/utils/scrollPosition';
import storage from '@/utils/storage';
import { Modal } from 'ant-design-vue';

export default async (to: any, from: any, next: Function) => {
  Modal.destroyAll();
  nprogress.start();
  ScrollPosition.save(from.path);

  if (!storage.get('ACCESS_TOKEN') && to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
};
