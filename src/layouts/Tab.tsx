import { Vue, Component, Watch } from 'vue-property-decorator';
import NavTab, { AddTabOptions } from '@/components/container/NavTab';
import { MenuModule } from '@/store/modules/menu';
import ResizeObserver from 'resize-observer-polyfill';
import { i18nRender } from '@/locales';

@Component
export default class Tab extends Vue {
  private current = ''; // 页面编码

  mounted() {
    this.update({
      label: i18nRender(this.$route.meta.title).toString(),
      code: this.$route.name || '',
    });

    const dom: any = document.querySelector('.framework-tab');
    const robserver = new ResizeObserver((entries: Array<any>) => {
      // const obj = entries[0].contentRect.width;
      // 变化回调
    });

    robserver.observe(dom);
  }

  @Watch('$route')
  protected routeChange() {
    this.update({
      label: i18nRender(this.$route.meta.title).toString(),
      code: this.$route.name || '',
    });
  }

  protected update(data: AddTabOptions) {
    this.current = data.code;
    this.$refs.navtab.addTab({ label: data.label, code: data.code });
  }

  $refs!: {
    navtab: NavTab;
  };

  render() {
    return (
      <div class="framework-tab">
        <NavTab
          ref="navtab"
          node-key="code"
          value={this.current}
          onTabClick={(data: AddTabOptions) => {
            if (data.code !== this.current) {
              this.$router.push({ name: data.code });
            }
          }}
          onTabRemove={(oldObj: AddTabOptions[], newObj?: AddTabOptions) => {
            const arr = oldObj.map(item => item.code);
            MenuModule.delete(arr);

            if (newObj) {
              this.$router.push({ name: newObj.code });
            }

            this.$nextTick(() => {
              MenuModule.add(arr);
            });
          }}
        />
      </div>
    );
  }
}
