import { Vue } from 'vue-property-decorator';
const cache: any = {};
const str = '.framework-content-layout';

export default {
  save(path: string) {
    const doc = document.querySelector(str);
    cache[path] = doc ? doc.scrollTop : 0;
  },
  get(this: Vue) {
    const path = this.$route.path;
    this.$nextTick(function() {
      const doc: any = document.querySelector(str);
      doc.scrollTop = cache[path] || 0;
    });
  },
  goTop(this: Vue) {
    this.$nextTick(function() {
      const doc: any = document.querySelector(str);
      doc.scrollTop = 0;
    });
  },
};
