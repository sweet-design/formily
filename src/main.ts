import './public-path';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import i18n from './locales';
import './imports';
import initializer from '@/config/initializer';

Vue.config.productionTip = false;

let instance: any = null;
function render(props: any = {}) {
  const { container } = props;

  instance = new Vue({
    router,
    store,
    i18n,
    created: initializer,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('vue 应用被启动');
}

export async function mount(props: any) {
  console.log('%cant-vue-pc应用挂载后的参数信息', 'color: blue;font-weight: bold;', props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  // router = null;
}
