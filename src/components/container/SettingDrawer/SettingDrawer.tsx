import { Vue, Component, Emit } from 'vue-property-decorator';
import './SettingDrawer.less';
import { AppModule } from '@/store/modules/app';
import { colorList, updateTheme, updateColorWeak } from './settingConfig';

@Component
export default class SettingDrawer extends Vue {
  private visible = false;

  public showDrawer() {
    this.visible = true;
  }

  /**
   * 推送到父级事件监听
   */
  @Emit('switch')
  protected stateSwitch(cate: string, value: string | boolean) {}

  private changeColor(color: string) {
    if (color !== AppModule.getTheme.primaryColor) {
      AppModule.SET_PRIMARYCOLOR(color);
      updateTheme(color);
    }
  }

  render() {
    return (
      <a-drawer
        placement="right"
        width="300"
        closable
        visible={this.visible}
        onClose={() => {
          this.visible = false;
        }}
      >
        <div class="ant-pro-setting-drawer-content">
          <div>
            <h3 class="ant-pro-setting-drawer-title">整体风格设置</h3>
            <div class="ant-pro-setting-drawer-block-checbox">
              <a-tooltip placement="top" title="亮色菜单风格">
                <div
                  class="ant-pro-setting-drawer-block-checbox-item"
                  onClick={() => {
                    this.stateSwitch('navTheme', 'light');
                  }}
                >
                  <img src="https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg" />
                  <div class="ant-pro-setting-drawer-block-checbox-selectIcon">
                    {AppModule.getTheme.navTheme === 'light' ? <a-icon type="check" /> : null}
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip placement="top" title="暗色菜单风格">
                <div
                  class="ant-pro-setting-drawer-block-checbox-item"
                  onClick={() => {
                    this.stateSwitch('navTheme', 'dark');
                  }}
                >
                  <img src="https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg" />
                  <div class="ant-pro-setting-drawer-block-checbox-selectIcon">
                    {AppModule.getTheme.navTheme === 'dark' ? <a-icon type="check" /> : null}
                  </div>
                </div>
              </a-tooltip>
              {/* <a-tooltip placement="top" title="暗黑模式">
								<div class="ant-pro-setting-drawer-block-checbox-item">
									<img src="https://gw.alipayobjects.com/zos/antfincdn/hmKaLQvmY2/LCkqqYNmvBEbokSDscrm.svg" />
									<div class="ant-pro-setting-drawer-block-checbox-selectIcon">
										<a-icon type="check" />
									</div>
								</div>
							</a-tooltip> */}
            </div>
          </div>
          <div class="theme-color">
            <h3 class="theme-color-title">主题色</h3>
            <div class="theme-color-content">
              {colorList.map(item => {
                return (
                  <a-tooltip placement="top" title={item.key} key={item.color}>
                    <div
                      class="theme-color-block"
                      style={{ backgroundColor: item.color }}
                      onClick={this.changeColor.bind(this, item.color)}
                    >
                      {item.color === AppModule.getTheme.primaryColor ? (
                        <a-icon type="check"></a-icon>
                      ) : null}
                    </div>
                  </a-tooltip>
                );
              })}
            </div>
          </div>
          <a-divider></a-divider>
          <div style="margin-bottom: 24px;">
            <h3 class="ant-pro-setting-drawer-title">导航模式</h3>
            <div class="ant-pro-setting-drawer-block-checbox">
              <a-tooltip placement="top" title="侧边菜单布局">
                <div
                  class="ant-pro-checkbox-item ant-pro-checkbox-item-side"
                  onClick={() => {
                    this.stateSwitch('layout', 'side');
                  }}
                >
                  <div class="ant-pro-setting-drawer-block-checbox-selectIcon">
                    {AppModule.getTheme.layout === 'side' ? <a-icon type="check" /> : null}
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip placement="top" title="顶部菜单布局">
                <div
                  class="ant-pro-checkbox-item ant-pro-checkbox-item-top"
                  onClick={() => {
                    this.stateSwitch('layout', 'top');
                  }}
                >
                  <div class="ant-pro-setting-drawer-block-checbox-selectIcon">
                    {AppModule.getTheme.layout === 'top' ? <a-icon type="check" /> : null}
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip placement="top" title="混合菜单布局">
                <div
                  class="ant-pro-checkbox-item ant-pro-checkbox-item-mix"
                  onClick={() => {
                    this.stateSwitch('layout', 'mix');
                  }}
                >
                  <div class="ant-pro-setting-drawer-block-checbox-selectIcon">
                    {AppModule.getTheme.layout === 'mix' ? <a-icon type="check" /> : null}
                  </div>
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="ant-list">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <ul class="ant-list-items">
                  <li class="ant-list-item">
                    <span style="opacity: 1;">固定 Header</span>
                    <ul class="ant-list-item-action">
                      <li>
                        <a-switch size="small" default-checked />
                      </li>
                    </ul>
                  </li>
                  <li class="ant-list-item">
                    <span style="opacity: 1;">固定侧边栏</span>
                    <ul class="ant-list-item-action">
                      <li>
                        <a-switch size="small" default-checked />
                      </li>
                    </ul>
                  </li>
                  <li class="ant-list-item">
                    <span style="opacity: 1;">侧边栏开启手风琴模式</span>
                    <ul class="ant-list-item-action">
                      <li>
                        <a-switch size="small" default-checked />
                      </li>
                    </ul>
                  </li>
                  <li class="ant-list-item">
                    <span style="opacity: 1;">显示重载页面按钮</span>
                    <ul class="ant-list-item-action">
                      <li>
                        <a-switch size="small" default-checked />
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <a-divider></a-divider>
          <div>
            <h3 class="ant-pro-setting-drawer-title">其他设置</h3>
            <div class="ant-list">
              <div class="ant-spin-nested-loading">
                <div class="ant-spin-container">
                  <ul class="ant-list-items">
                    <li class="ant-list-item">
                      <span style="opacity: 1;">多页签</span>
                      <ul class="ant-list-item-action">
                        <li>
                          <a-switch
                            size="small"
                            onChange={(checked: boolean) => {
                              this.stateSwitch('multiTab', checked);
                            }}
                            defaultChecked={AppModule.getMultiTab}
                          />
                        </li>
                      </ul>
                    </li>
                    <li class="ant-list-item">
                      <span style="opacity: 1;">色弱模式</span>
                      <ul class="ant-list-item-action">
                        <li>
                          <a-switch
                            size="small"
                            onChange={(checked: boolean) => {
                              updateColorWeak(checked);
                              this.stateSwitch('weak', checked);
                            }}
                            defaultChecked={false}
                          />
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <a-divider></a-divider>
          <a-alert
            message="配置栏只在开发环境用于预览，生产环境不会展现！"
            type="warning"
            show-icon
            icon={<a-icon type="notification" />}
          />
        </div>
      </a-drawer>
    );
  }
}
