import { CreateElement, RenderContext } from 'vue';
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface Testfunctional extends RenderContext {
  listeners: {
    change: Function;
  };
}

@Component({
  functional: true,
})
export default class Test extends Vue {
  @Prop({
    type: Number,
    default: 456,
  })
  ages!: number;

  render(createElement: CreateElement, context: Testfunctional) {
    console.log(context);

    return (
      <div>
        <span>{context.props.ages}</span>
        {context.children}
        <a-button
          onClick={() => {
            context.listeners.change(123);
          }}
        >
          点击
        </a-button>
      </div>
    );
  }
}
