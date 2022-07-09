import { RouteConfig } from 'vue-router';

const list: Array<RouteConfig> = [];
const files = require.context('@/views/business', true, /\.vue|.tsx$/);

files.keys().forEach(item => {
  const fileName = item
    .split('/')
    .reverse()[0]
    .split('.')[0];

  list.push({
    path: item.substr(1).split('.')[0],
    name: fileName,
    code: fileName,
    component: () => import(`@/views/business${item.substr(1)}`),
  });
});

export default list;
