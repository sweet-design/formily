import { Vue, Component } from 'vue-property-decorator';
import Sider from './Sider';
import Header from './Header';
import Content from './Content';
import Tab from './Tab';
import 'ASSETS/less/framework/FrameworkBase.less';
import classnames from 'classnames';
import { AppModule } from '@/store/modules/app';

@Component
export default class FrameworkBase extends Vue {
  private collapsed = false;

  render() {
    const layout = AppModule.getTheme.layout;
    return (
      <div class="framework-base-wrapper">
        {window.__POWERED_BY_QIANKUN__ ? (
          <Content></Content>
        ) : (
          <a-layout
            hasSider={layout === 'side' || layout === 'mix'}
            style={{ height: '100vh', minHeight: '100vh' }}
          >
            {layout === 'side' || layout === 'mix'
              ? [
                  <div
                    class={classnames('framework-sider-placeholder', { collapsed: this.collapsed })}
                  ></div>,
                  <Sider
                    props={{
                      collapsed: this.collapsed,
                      onCollapsed: () => {
                        this.collapsed = !this.collapsed;
                      },
                    }}
                  ></Sider>,
                ]
              : null}

            <a-layout>
              <Header class={classnames({ 'mix-layout': layout === 'mix' })}></Header>
              {layout === 'mix' && <a-layout-header class="header-placeholder"></a-layout-header>}
              {AppModule.getMultiTab ? <Tab></Tab> : null}
              <Content></Content>
            </a-layout>
          </a-layout>
        )}
      </div>
    );
  }
}
