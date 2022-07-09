import nprogress from '@/utils/nprogress';
export default (to: any, from: any) => {
  nprogress.done();
  const decode = decodeURIComponent;
  console.info(`%c[路由日志] ${decode(from.path || '')} => ${decode(to.path)}`, 'color: #1890ff;');
};
