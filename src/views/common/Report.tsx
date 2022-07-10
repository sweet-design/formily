import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class Report extends Vue {
  private lebron = '';

  @Watch('$route')
  protected routeChange(to: any, from: any) {
    alert(to.name);
  }

  render() {
    return (
      <div>
        <a-input v-model={this.lebron}></a-input>
      </div>
    );
  }
}
