import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import './index.less';
import classnames from 'classnames';
import IconFont from '@/assets/iconfont/IconFont';
import { AddTabOptions } from './types';

@Component
export default class NavTab extends Vue {
  private tabs: AddTabOptions[] = []; // 缓存tabs

  private scrollWidth = 0; // 滚动容器的宽度
  private scrollLeft = 0; // 滚动容器距离左侧的距离
  private translateX = 0; // 当前content容器移动的距离
  private contentObj: any = null; // 页签直接父级元素

  private showPrevNext = false; // 是否显示上一页和下一页按钮

  private optState = {
    left: false,
    right: false,
    other: false,
    all: false,
  };

  private optLeft = true;
  private optRight = true;

  /**
   * 数据选项唯一key
   */
  @Prop({
    type: String,
    required: true,
  })
  private readonly nodeKey!: string;

  /**
   * 当前选中的唯一标识
   */
  @Prop({
    type: String,
    required: true,
  })
  private value!: string;

  /**
   * 切换tab之前的回调
   */
  @Prop({
    type: Function,
    required: false,
    default: (data: AddTabOptions): boolean => {
      return true;
    },
  })
  private beforeLeave!: Function;

  /**
   * 动态添加tab
   * @param data tab数据
   */

  public addTab(data: AddTabOptions) {
    const results = this.tabs.find(item => item[this.nodeKey] === data[this.nodeKey]);
    // 如果不存在，需要增加页签，否则切换页签
    if (!results) {
      this.tabs.push(data);
    }

    this.$nextTick(() => {
      this.animations();
    });
  }

  protected animations() {
    this.getScrollPages();

    if (this.showPrevNext) {
      // 显示
      if (this.contentObj.clientWidth <= this.scrollWidth + 76) {
        this.showPrevNext = false;
      }
    } else {
      // 不显示
      if (this.contentObj.clientWidth > this.scrollWidth) {
        this.showPrevNext = true;
      }
    }

    this.$nextTick(() => {
      this.getScrollPages();
      const box: any = document.querySelector('.component-nav-tab .selected'); // 当前选中的页签宽度
      const pages = {
        left: box.getBoundingClientRect().left,
        width: box.clientWidth,
      };

      const scrollAllWidth = this.scrollLeft + this.scrollWidth; // 滚动区域最右侧距离屏幕左边的距离
      const pagesWidth = pages.left + pages.width; // 选中的页签最右侧距离屏幕左边的距离

      if (pages.left >= this.scrollLeft && pagesWidth <= this.scrollWidth + this.scrollLeft) {
        // 当前页签在中间
      } else if (pages.left < this.scrollLeft) {
        // 全部在左侧或部分在左侧
        this.translateX += this.scrollLeft - pages.left;
      } else if (pages.left < scrollAllWidth && pagesWidth > scrollAllWidth) {
        // 部分在右侧
        this.translateX -= pagesWidth - scrollAllWidth;
      } else if (pages.left >= scrollAllWidth) {
        // 全部在右侧
        this.translateX -= pagesWidth - scrollAllWidth;
      } else if (pages.left < this.scrollLeft && pagesWidth > scrollAllWidth) {
        // 单个页签部分在左侧，部分在右侧，即宽度大于滚动容器的总宽度
        this.translateX += this.scrollLeft - pages.left;
      }

      if (this.contentObj.clientWidth <= this.scrollWidth) {
        this.translateX = 0;
      }

      this.optSelect();

      this.contentObj.style.transform = `translateX(${this.translateX}px)`;
    });
  }

  optSelect() {
    this.optLeft = this.translateX === 0 ? true : false;
    this.optRight =
      this.contentObj.clientWidth - Math.abs(this.translateX) === this.scrollWidth ? true : false;
  }

  mounted() {
    this.getScrollPages();
    this.contentObj = this.$refs.content;
  }

  // 获取滚动容器所在的位置信息
  public getScrollPages() {
    this.scrollWidth = (this.$refs.scroll as any).clientWidth;
    this.scrollLeft = (this.$refs.scroll as any).getBoundingClientRect().left;
  }

  /**
   * 推送到父级事件监听
   * @param oldObj 老对象
   * @param newObj 新对象
   */
  @Emit('tabRemove')
  protected tabRemoveHandle(oldObj: AddTabOptions[], newObj?: AddTabOptions) {}

  /**
   * 切换页签后推送到父级事件监听
   * @param data 当前点击后选中的页签
   */
  @Emit('tabClick')
  protected tabClickHandle(data: AddTabOptions) {}

  /**
   * 单个关闭回调
   */
  private singleClose(item: any, e: Event) {
    const width = (e.currentTarget as any).parentElement.parentElement.clientWidth;

    // 待关闭的页签所在的索引
    const ids = this.tabs.findIndex(ele => ele[this.nodeKey] === item[this.nodeKey]);

    if (this.value === item[this.nodeKey]) {
      let newObj = null;
      // 如果当前关闭的是最后一个，默认选中前一个，否则选后面一个
      if (ids === this.tabs.length - 1) {
        newObj = this.tabs[ids - 1];
      } else {
        newObj = this.tabs[ids + 1];
      }

      this.tabRemoveHandle([item], newObj);
    } else {
      this.tabRemoveHandle([item]);
    }

    this.tabs.splice(ids, 1);

    this.$nextTick(() => {
      if (this.translateX === 0) {
        return;
      } else {
        if (Math.abs(this.translateX) < width) {
          this.translateX = 0;
        } else {
          this.translateX += width;
        }
      }

      this.animations();
    });
  }

  public optCallback(data: any) {
    const idx = this.tabs.findIndex(item => item[this.nodeKey] === this.value);
    let deleteArr: any[] = [];

    switch (data.key) {
      case 'left': // 关闭左侧
        {
          deleteArr = this.tabs.slice(1, idx);
          this.tabRemoveHandle(deleteArr);
        }
        break;
      case 'right': // 关闭右侧
        {
          deleteArr = this.tabs.slice(idx + 1);
          this.tabRemoveHandle(deleteArr);
        }
        break;
      case 'other': // 关闭其他
        {
          if (idx === 0) {
            deleteArr = this.tabs.slice(1);
          } else if (idx === 1) {
            deleteArr = this.tabs.slice(2);
          } else {
            deleteArr = this.tabs.slice(1, idx).concat(this.tabs.slice(idx + 1));
          }

          this.tabRemoveHandle(deleteArr);
        }
        break;
      case 'all': // 关闭全部
        {
          deleteArr = this.tabs.slice(1);
          this.tabRemoveHandle(deleteArr, this.tabs[0]);
        }
        break;
    }

    this.tabs = this.tabs.filter(val => deleteArr.indexOf(val) === -1);

    this.$nextTick(() => {
      this.animations();
    });
  }

  render() {
    return (
      <div class="component-nav-tab">
        <div class="component-nav-tab-main">
          <div class="panes">
            <div class={classnames('panes-container', { padding: this.showPrevNext })}>
              {this.showPrevNext ? (
                <span
                  class={classnames('prev', { disabled: this.optLeft })}
                  onClick={() => {
                    const contentWidth = this.contentObj.clientWidth;
                    if (contentWidth <= this.scrollWidth || this.translateX == 0) {
                      return;
                    }

                    if (Math.abs(this.translateX / this.scrollWidth) >= 1) {
                      this.translateX += this.scrollWidth;
                    } else {
                      this.translateX = 0;
                    }

                    this.optSelect();

                    this.contentObj.style.transform = `translateX(${this.translateX}px)`;
                  }}
                >
                  <IconFont type="saas-arrow-left" />
                </span>
              ) : null}
              {this.showPrevNext ? (
                <span
                  class={classnames('next', { disabled: this.optRight })}
                  onClick={() => {
                    const contentWidth = this.contentObj.clientWidth;
                    if (contentWidth <= this.scrollWidth) {
                      return;
                    }

                    if (contentWidth - this.scrollWidth == Math.abs(this.translateX)) {
                      return;
                    } else {
                      const diff = contentWidth - this.scrollWidth - Math.abs(this.translateX);
                      if (diff / this.scrollWidth >= 1) {
                        this.translateX -= this.scrollWidth;
                      } else {
                        this.translateX -= diff;
                      }

                      this.optSelect();

                      this.contentObj.style.transform = `translateX(${this.translateX}px)`;
                    }
                  }}
                >
                  <IconFont type="saas-arrow-right" />
                </span>
              ) : null}
              <div class="scroll" ref="scroll">
                <div class="content" ref="content">
                  {this.tabs.map((item, index) => {
                    return (
                      <div
                        class={classnames('tab', {
                          selected: item[this.nodeKey] === this.value,
                        })}
                        onClick={() => {
                          this.tabClickHandle(item);
                        }}
                      >
                        <div class="item">
                          <span>{item.label}</span>
                          {index !== 0 ? (
                            <a-icon
                              type="close"
                              class="close"
                              onClick={(e: Event) => {
                                e.stopPropagation();
                                this.singleClose(item, e);
                              }}
                              style={{
                                fontSize: '12px',
                                marginLeft: '5px',
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <a-dropdown
            placement="bottomRight"
            onVisibleChange={(visible: boolean) => {
              if (visible) {
                const idx = this.tabs.findIndex(item => item[this.nodeKey] === this.value);

                this.optState.left = idx <= 1 ? true : false;
                this.optState.right = idx === this.tabs.length - 1 ? true : false;
                this.optState.other = idx === 1 && this.tabs.length === 2 ? true : false;
                this.optState.all = this.tabs.length === 1 ? true : false;
              }
            }}
          >
            <div class="panes-opts">
              <a-icon type="more" />
            </div>
            <a-menu slot="overlay" onClick={this.optCallback} style={{ minWidth: '120px' }}>
              <a-menu-item key="left" disabled={this.optState.left}>
                <a-icon type="arrow-left" />
                <span>关闭左侧</span>
              </a-menu-item>
              <a-menu-item key="right" disabled={this.optState.right}>
                <a-icon type="arrow-right" />
                <span>关闭右侧</span>
              </a-menu-item>
              <a-menu-item key="other" disabled={this.optState.other}>
                <a-icon type="close" />
                <span>关闭其他</span>
              </a-menu-item>
              <a-menu-item key="all" disabled={this.optState.all}>
                <a-icon type="close-circle" />
                <span>全部关闭</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    );
  }
}
