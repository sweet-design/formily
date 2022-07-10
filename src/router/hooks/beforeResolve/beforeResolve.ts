import { setDocumentTitle, domTitle } from '@/utils/domUtil';
import storage from '@/utils/storage';

export default async (to: any, from: any, next: Function) => {
  to.meta &&
    typeof to.meta.title !== 'undefined' &&
    setDocumentTitle(`${to.meta.title} - ${domTitle}`);

  if (!storage.get('ACCESS_TOKEN') && to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
};
