import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Error500 extends Vue {
  render() {
    return (
      <div>
        <span>500页面</span>
      </div>
    );
  }
}
