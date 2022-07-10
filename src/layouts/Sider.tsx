import { Vue, Component, Prop } from 'vue-property-decorator';
import classnames from 'classnames';
import IconFont from '@/assets/iconfont/IconFont';
import { MenuModule } from '@/store/modules/menu';
import { AppModule } from '@/store/modules/app';
import config from '@/config/default.config';
import { i18nRender } from '@/locales';
import { RouteConfig } from 'vue-router';
import storage from '@/utils/storage';

@Component
export default class Sider extends Vue {
  /**
   * 是否水平折叠收起菜单
   */
  @Prop({
    type: Boolean,
    required: true,
  })
  private readonly collapsed!: boolean;

  /**
   * 切换回调给父组件
   */
  @Prop({
    type: Function,
    required: true,
    default: () => {},
  })
  onCollapsed!: Function;

  private logo = require('@/assets/images/logo.svg');
  private routerData: RouteConfig = storage.get('ROUTER_DATA');

  /**
   * 更新展开的SubMenu列表
   * @param value 展开的SubMenu列表
   */
  updateOpenKeys(value: string[]) {
    MenuModule.switchOpenKeys(value);
  }

  get getNavTheme() {
    return AppModule.getTheme.layout === 'mix' ? 'light' : AppModule.getTheme.navTheme;
  }

  render() {
    return (
      <a-layout-sider
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsedWidth={48}
        theme={this.getNavTheme}
        collapsed={this.collapsed}
        class={classnames({
          'framework-sider': true,
          'framework-sider-fixed': true,
          'padding-top': AppModule.getTheme.layout === 'mix',
        })}
        onCollapse={(collapsed: boolean, type: string) => {
          type === 'responsive' && this.onCollapsed();
        }}
      >
        {AppModule.getTheme.layout === 'side' && (
          <div
            class={classnames({
              'framework-sider-logo': true,
              collapsed: this.collapsed,
            })}
          >
            <a>
              <img src={this.logo} alt="logo" />
              {!this.collapsed ? <h1>{config.title}</h1> : null}
            </a>
          </div>
        )}
        <div class="framework-sider-menu">
          <a-menu
            // defaultSelectedKeys={[config.home]}
            // defaultOpenKeys={(() => {
            // 	const arr = config.home.split('/');
            // 	return arr.slice(1, arr.length - 1);
            // })()}
            props={this.collapsed ? null : { openKeys: MenuModule.getOpenKeys }}
            on={{ ['update:openKeys']: this.updateOpenKeys }}
            selectedKeys={MenuModule.getSelectedKeys}
            mode="inline"
            theme={this.getNavTheme}
            inlineIndent={16}
            onClick={(data: any) => {
              this.$router.push({ name: data.key });
            }}
          >
            {this.routerData.children?.map(item => {
              return item.nodeType === 'page' ? (
                <a-menu-item key={item.code}>{i18nRender(item.meta.title)}</a-menu-item>
              ) : (
                <a-sub-menu
                  key={item.code}
                  scopedSlots={{
                    title: () => {
                      return (
                        <span>
                          {item.meta.icon && <IconFont type={item.meta.icon} />}
                          <span>{i18nRender(item.meta.title)}</span>
                        </span>
                      );
                    },
                  }}
                >
                  {item.children?.map(sub => {
                    return sub.nodeType === 'page' ? (
                      <a-menu-item key={sub.code}>{i18nRender(sub.meta.title)}</a-menu-item>
                    ) : (
                      <a-sub-menu
                        key={sub.code}
                        scopedSlots={{
                          title: () => {
                            return (
                              <span>
                                {sub.meta.icon && <IconFont type={sub.meta.icon} />}
                                <span>{i18nRender(sub.meta.title)}</span>
                              </span>
                            );
                          },
                        }}
                      >
                        {sub.children?.map(son => {
                          return (
                            <a-menu-item key={son.code}>{i18nRender(son.meta.title)}</a-menu-item>
                          );
                        })}
                      </a-sub-menu>
                    );
                  })}
                </a-sub-menu>
              );
            })}
          </a-menu>
        </div>
        <div class="framework-sider-links">
          <a-menu
            mode="inline"
            theme={this.getNavTheme}
            inlineIndent={16}
            selectable={false}
            onClick={() => this.onCollapsed()}
            style={{ borderRight: 0, width: '100%' }}
          >
            <a-menu-item title={null}>
              <span>
                <a-icon type={this.collapsed ? 'menu-unfold' : 'menu-fold'} />
              </span>
            </a-menu-item>
          </a-menu>
        </div>
      </a-layout-sider>
    );
  }
}
