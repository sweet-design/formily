import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import getters from './global/getters';
import state from './global/state';
import mutations from './global/mutations';
import actions from './global/actions';
import queue from './modules/queue';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: { queue },
  state,
  mutations,
  getters,
  actions,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          queue: val.queue,
        };
      },
    }),
  ],
});
