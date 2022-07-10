import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Error404 extends Vue {
  render() {
    return (
      <div>
        <span>404页面</span>
      </div>
    );
  }
}
