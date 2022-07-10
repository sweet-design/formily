import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Mixin extends Vue {
  /**
   * 获取多语言数据
   * @param key 多语言path
   * @param defaultValue 没找到指定path，默认显示
   * @returns 多语言值
   */
  getLangResult(key: string, defaultValue: string) {
    if (this.$te(key)) {
      return this.$t(key);
    }

    return defaultValue;
  }
}
