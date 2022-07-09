import simpleLogger from './afterEach/simpleLogger';
import simpleComplete from './afterEach/simpleComplete';
import authCheck from './beforeEach/authCheck';
import beforeResolve from './beforeResolve/beforeResolve';

export default (router: any) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      router.afterEach(simpleLogger);
      break;
    case 'production':
      break;
    case 'sit':
      router.afterEach(simpleComplete);
      break;
    case 'uat':
      break;
    case 'mock':
      router.afterEach(simpleLogger);
      break;
  }

  router.beforeEach(authCheck);
  router.beforeResolve(beforeResolve);
};
