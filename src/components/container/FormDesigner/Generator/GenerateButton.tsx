import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class GenerateButton extends Vue {
  /**
   * 单个控件配置信息
   */
  @Prop({
    type: Object,
    required: true,
    default: () => ({}),
  })
  widget: any;

  /**
   * 表单数据对象
   */
  @Prop({
    type: Object,
    required: true,
    default: () => ({}),
  })
  data: any;

  /**
   * 远端数据操作方法
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: any;

  /**
   * form表单最外层配置
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  globalConfig!: any;

  executeStr(obj: string) {
    return Function('"use strict";return (' + obj + ')')();
  }

  created() {}

  render() {
    return (
      <div
        style={
          this.widget.options.inline
            ? {
                textAlign: this.widget.options.justify,
                display: 'inline-block',
                marginLeft: this.widget.options.float == 'left' ? '0' : '10px',
                marginRight: this.widget.options.float == 'left' ? '10px' : '0',
                float: this.widget.options.float,
              }
            : { textAlign: this.widget.options.justify }
        }
      >
        {this.widget.options.group ? (
          <a-dropdown>
            <a-menu slot="overlay">
              {this.widget.options.groupList.map((item: any, index: number) => {
                return (
                  <a-menu-item
                    key={index}
                    onClick={() => {
                      if (this.remote[item.handleEvent]) {
                        this.remote[item.handleEvent](this.data);
                      }
                    }}
                  >
                    {item.icon !== '' && <a-icon type={item.icon} />} {item.title}
                  </a-menu-item>
                );
              })}
            </a-menu>
            <a-button
              style={this.widget.options.customStyle}
              disabled={this.widget.options.disabled}
              size={this.globalConfig.size}
              type={this.widget.options.type}
              icon={this.widget.options.icon}
            >
              {this.widget.title} <a-icon type="down" />
            </a-button>
          </a-dropdown>
        ) : (
          <a-button
            style={this.widget.options.customStyle}
            disabled={this.widget.options.disabled}
            size={this.globalConfig.size}
            type={this.widget.options.type}
            icon={this.widget.options.icon}
            onClick={() => {
              if (!this.widget.options.group && this.remote[this.widget.options.handleEvent]) {
                this.remote[this.widget.options.handleEvent](this.data);
              }
            }}
          >
            {this.widget.title}
          </a-button>
        )}
      </div>
    );
  }
}
