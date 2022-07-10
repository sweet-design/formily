import { Vue, Component, Provide, Watch } from 'vue-property-decorator';
import FrameworkBase from '@/layouts/FrameworkBase';
import { MenuModule } from '@/store/modules/menu';
import { AppModule } from '@/store/modules/app';
import RouterTransform from '@/router/middlewares/RouterTransform';
import storage from '@/utils/storage';
import uniq from 'lodash.uniq';

@Component
export default class Index extends Vue {
  @Provide('reload')
  Reload = this.reload;

  reload() {
    const obj = MenuModule;
    const name = this.$route.name || '';
    const result = obj.check(name);

    obj.update(false);
    result && obj.delete(name);
    this.$nextTick(() => {
      obj.update(true);
      result && obj.add(name);
    });
  }

  created() {
    this.updateMenu();

    let name = '';

    if (this.$route.fullPath !== '/') {
      name = this.$route.name || '';
    } else if (AppModule.getHomeType === '0') {
      name = AppModule.getHome;
    } else {
      const routes = RouterTransform(storage.get('ROUTER_DATA'));
      name = routes[0].code || '';
    }

    this.$router.push({ name: name });
  }

  @Watch('$route')
  protected routeChange() {
    this.updateMenu();
  }

  protected updateMenu() {
    const menuStore = MenuModule;
    menuStore.switchSelectedKeys(this.$route.name || '');
    const openKeys: string[] = menuStore.getOpenKeys;
    const arr = this.$route.path.split('/').slice(1, -1);
    menuStore.switchOpenKeys(uniq([...openKeys, ...arr]));
  }

  render() {
    return (
      <div class="index-wrapper">
        <FrameworkBase />
      </div>
    );
  }
}
