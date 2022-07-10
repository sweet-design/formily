import { Vue, Component } from 'vue-property-decorator';
import { AppModule } from '@/store/modules/app';
import { domTitle, setDocumentTitle } from '@/utils/domUtil';
import { i18nRender } from '@/locales';

@Component
export default class App extends Vue {
  get locale() {
    const { title } = this.$route.meta;
    title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`);
    return this.$i18n.getLocaleMessage(AppModule.getLang).antLocale;
  }

  render() {
    return (
      <a-config-provider locale={this.locale}>
        <div id="app">
          <router-view />
        </div>
      </a-config-provider>
    );
  }
}
