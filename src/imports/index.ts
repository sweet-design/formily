import Vue from 'vue';
import VueStorage from 'vue-ls';
import config from '@/config/default.config';
import Component from 'vue-class-component';
import '@/assets/less/global.less';
import './ant-design-vue';
import '../directives/action';
import VueIntro from 'vue-introjs';
import 'intro.js/introjs.css';

Vue.use(VueIntro as any);

Vue.use(VueStorage, config.localStorage);
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate']);
