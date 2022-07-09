import { Vue, Component } from 'vue-property-decorator';
import '@/assets/less/user/Login.less';
import storage from '@/utils/storage';
import RouterConfig from '@/router/RouterConfig';
import mapping from '@/router/middlewares/Mapping';
import { getTokenInfo } from '@/apis/auth';

@Component
export default class Login extends Vue {
  private logo = require('@/assets/images/logo.svg');
  private loading = false;
  private tipsError = false;

  login(e: Event) {
    e.preventDefault();
    this.form.validateFields(async (err: any, values: any) => {
      if (err) return;

      this.loading = true;

      if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'mock') {
        setTimeout(() => {
          if (values.username !== 'admin' || values.password !== 'lebron') {
            this.tipsError = true;
            this.loading = false;
            return;
          }

          storage.set('ROUTER_DATA', RouterConfig, new Date().getTime() + 7200 * 1000);
          mapping().forEach((item: any) => {
            this.$router.addRoute('Home', item);
          });

          storage.set('ACCESS_TOKEN', values, new Date().getTime() + 7200 * 1000);
          this.$router.push({ name: 'Home' });
        }, 1000);
      } else if (process.env.NODE_ENV == 'sit') {
        const res = await getTokenInfo({
          tenantCode: 'BQ',
          identityType: 'login_name',
          identifier: 'jaychen',
          credential: '92925488B28AB12584AC8FCAA8A27A0F497B2C62940C8F4FBC8EF19EBC87C43E',
        });

        if (res.code === 200) {
          storage.set(
            'ROUTER_DATA',
            RouterConfig,
            new Date().getTime() + res.data.tokenInfo.expires_in * 1000,
          );
          mapping().forEach((item: any) => {
            this.$router.addRoute('Home', item);
          });

          storage.set(
            'ACCESS_TOKEN',
            res.data.tokenInfo.token,
            new Date().getTime() + res.data.tokenInfo.expires_in * 1000,
          );
          storage.set(
            'TOKEN_TYPE',
            res.data.tokenInfo.token_type,
            new Date().getTime() + res.data.tokenInfo.expires_in * 1000,
          );

          this.$router.push({ name: 'Home' });
        } else {
          this.tipsError = true;
          this.loading = false;
          this.$message.error(res.msg);
        }
      }
    });
  }

  private form: any = null;

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  }

  render() {
    return (
      <div class="login-wrapper">
        <div class="login-wrapper-content">
          <div class="login-wrapper-content-top">
            <div class="login-wrapper-content-top-header">
              <a href="/">
                <img alt="logo" class="login-wrapper-content-top-header-logo" src={this.logo} />
                <span class="login-wrapper-content-top-header-title">Admin Pro</span>
              </a>
            </div>
            <div class="login-wrapper-content-top-desc">
              <span>Coho Admin Pro 企业级中台前端解决方案</span>
            </div>
          </div>
          <div class="login-wrapper-content-form">
            {this.tipsError ? (
              <a-alert
                style="margin-bottom: 24px;"
                message="用户或密码错误"
                type="error"
                show-icon
              />
            ) : null}
            <a-form onSubmit={this.login} form={this.form}>
              <a-form-item>
                <a-input
                  size="large"
                  tabindex="1"
                  v-decorator={[
                    'username',
                    {
                      initialValue: 'admin',
                      rules: [{ required: true, message: '请输入用户名!' }],
                    },
                  ]}
                  placeholder="用户名"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  size="large"
                  tabindex="2"
                  v-decorator={[
                    'password',
                    {
                      initialValue: 'lebron',
                      rules: [{ required: true, message: '请输入密码!' }],
                    },
                  ]}
                  type="password"
                  placeholder="密码"
                >
                  <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button
                  size="large"
                  tabindex="3"
                  loading={this.loading}
                  type="primary"
                  block
                  html-type="submit"
                >
                  {this.loading ? `${this.$t('submitting')}...` : this.$t('submit')}
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    );
  }
}
