import Vue from 'vue';

const action = Vue.directive('action', {
  inserted: function(el, binding, vnode: any) {
    const list = vnode.context.$route.meta.permissions; // 获取权限列表
    const parent: any = el.parentNode;

    if (!list || list.length <= 0) {
      parent.removeChild(el);
    }

    if (list && list.length && !list.includes(binding.arg)) {
      parent.removeChild(el);
    }
  },
});

export default action;
