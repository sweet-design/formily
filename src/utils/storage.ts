import store from 'store';
import engine from 'store/src/store-engine';

const storages = [require('store/storages/sessionStorage')];
const plugins = [require('store/plugins/expire')];

export default engine.createStore(storages, plugins, 'coho_');
