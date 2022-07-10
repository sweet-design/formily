import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SubComponent1 extends Vue {
  render() {
    return (
      <div>
        <span>子组件1</span>
      </div>
    );
  }
}
