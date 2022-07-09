import { Vue, Component } from 'vue-property-decorator';
import { MenuModule } from '@/store/modules/menu';

@Component
export default class Content extends Vue {
  render() {
    return (
      <a-layout-content class="framework-content">
        <div class="framework-content-layout">
          <keep-alive include={MenuModule.getRoutes}>
            {MenuModule.getStatus ? <router-view /> : null}
          </keep-alive>
        </div>
      </a-layout-content>
    );
  }
}
