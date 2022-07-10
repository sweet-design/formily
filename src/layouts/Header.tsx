import { Vue, Component, Inject } from 'vue-property-decorator';
import classnames from 'classnames';
import IconFont from '@/assets/iconfont/IconFont';
import { MenuModule } from '@/store/modules/menu';
import { AppModule } from '@/store/modules/app';
import config from '@/config/default.config';
import SettingDrawer from '@/components/container/SettingDrawer';
import { i18nRender } from '@/locales';
import storage from '@/utils/storage';
import { RouteConfig } from 'vue-router';

@Component
export default class Header extends Vue {
  private logo = require('@/assets/images/logo.svg');
  private avatar = require('@/assets/images/avatar.png');
  private routerData: RouteConfig = storage.get('ROUTER_DATA');
  private spin = false;

  @Inject('reload')
  reload!: Function;

  get result() {
    return AppModule.getTheme.layout === 'side' || AppModule.getTheme.navTheme === 'light';
  }

  $refs!: {
    drawer: SettingDrawer;
  };

  render() {
    const layout = AppModule.getTheme.layout;

    return (
      <a-layout-header class="framework-header">
        <div class={classnames('framework-header-layout', { light: this.result })}>
          {layout === 'top' || layout === 'mix' ? (
            <div class="framework-header-layout-left">
              <div class="framework-header-layout-left-logo">
                <a>
                  <img src={this.logo} alt="logo" />
                  <h1>{config.title}</h1>
                </a>
              </div>
            </div>
          ) : null}

          {layout === 'top' ? (
            <div class="framework-header-layout-menu">
              <a-menu
                mode="horizontal"
                selectedKeys={MenuModule.getSelectedKeys}
                theme={AppModule.getTheme.navTheme}
                onClick={(data: any) => {
                  this.$router.push({ name: data.key });
                }}
              >
                {this.routerData.children?.map(item => {
                  return item.nodeType === 'page' ? (
                    <a-menu-item key={item.name}>{i18nRender(item.meta.title)}</a-menu-item>
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
                          <a-menu-item key={sub.name}>{i18nRender(sub.meta.title)}</a-menu-item>
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
                                <a-menu-item key={son.name}>
                                  {i18nRender(son.meta.title)}
                                </a-menu-item>
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
          ) : null}

          <div class="framework-header-layout-right">
            {/* <IconFont type="saas-user" class="header-btn-action"></IconFont> */}
            <a-icon
              type="ant-design"
              class="header-btn-action"
              onClick={() => {
                this.$router.push({ name: 'PageDesigner' });
              }}
            />
            <a-icon
              type="ant-design"
              class="header-btn-action"
              onClick={() => {
                this.$router.push({ name: 'FormDesignerNew' });
              }}
            />
            <a-tooltip
              placement="bottom"
              scopedSlots={{
                title: () => {
                  return <span>{i18nRender('refresh')}</span>;
                },
              }}
            >
              <a-icon
                type="reload"
                spin={this.spin}
                class="header-btn-action"
                onClick={() => {
                  this.spin = true;
                  this.reload();
                  const ids = setTimeout(() => {
                    this.spin = false;
                    clearTimeout(ids);
                  }, 1000);
                }}
              />
            </a-tooltip>
            <a-icon type="search" class="header-btn-action" />
            <a-icon type="question-circle" class="header-btn-action" />
            <a-icon type="bell" class="header-btn-action" />
            <a-dropdown
              placement="bottomRight"
              getPopupContainer={() => document.querySelector('.framework-header-layout-right')}
            >
              <span class="header-btn-action">
                <a-avatar size="small" src={this.avatar} />
                <span style={{ fontSize: '14px', marginLeft: '5px' }}>lebron</span>
              </span>
              <a-menu
                slot="overlay"
                onClick={(data: any) => {
                  if (data.key === 'Login') {
                    const confirm = this.$confirm({
                      content: '确定要注销吗？',
                      okButtonProps: {
                        props: {
                          loading: false,
                        },
                      },
                      onOk: () => {
                        return new Promise((resolve, reject) => {
                          confirm.update({
                            okButtonProps: {
                              props: {
                                loading: true,
                              },
                            },
                          });

                          storage.clearAll();

                          setTimeout(() => {
                            resolve(true);
                            this.$router.push({ name: data.key });
                          }, 500);
                        });
                      },
                    });
                  } else {
                    this.$router.push({ name: data.key });
                  }
                }}
                style={{ minWidth: '160px' }}
              >
                <a-menu-item key="AccountCenter">
                  <a-icon type="user" />
                  <span>{i18nRender('Menu.Account.AccountCenter')}</span>
                </a-menu-item>
                <a-menu-item key="AccountSetting">
                  <a-icon type="setting" />
                  <span>{i18nRender('Menu.Account.AccountSetting')}</span>
                </a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="Login">
                  <a-icon type="logout" />
                  <span>{i18nRender('Menu.Account.Logout')}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-dropdown
              placement="bottomRight"
              getPopupContainer={() => document.querySelector('.framework-header-layout-right')}
            >
              <a-icon type="global" class="header-btn-action" />
              <a-menu
                slot="overlay"
                onClick={(data: any) => {
                  AppModule.set_lang(data.key);
                  this.$message.success('语言切换成功');
                }}
                selectedKeys={[AppModule.getLang]}
                style={{ minWidth: '120px' }}
              >
                <a-menu-item key="en-US">
                  <span>us English</span>
                </a-menu-item>
                <a-menu-item key="zh-CN">
                  <span>cn 简体中文</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-icon
              type="more"
              class="header-btn-action"
              onClick={() => {
                this.$refs.drawer.showDrawer();
              }}
            />
          </div>
        </div>
        <SettingDrawer
          ref="drawer"
          onSwitch={(cate: string, value: string | boolean) => {
            const cates = `SET_${cate.toLocaleUpperCase()}`;
            (AppModule as any)[cates](value);
          }}
        />
      </a-layout-header>
    );
  }
}
