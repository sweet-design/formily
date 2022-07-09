import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MainComponent extends Vue {
  static SubComponent1: any = null;
  static SubComponent2: any = null;
  render() {
    return (
      <div>
        <span>主要组件</span>
      </div>
    );
  }
}
