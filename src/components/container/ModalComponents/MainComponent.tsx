import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MainComponent extends Vue {
  static Form: any = null;
  static List: any = null;
  render() {
    return (
      <div>
        <span>主要组件</span>
      </div>
    );
  }
}
