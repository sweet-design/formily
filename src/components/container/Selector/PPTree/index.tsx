import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import debounce from 'lodash.debounce';
import './index.less';

@Component
export default class PageTree extends Vue {
  /**
   * 替换字段，对应数据源数据
   */
  @Prop({
    type: Object,
    default: { children: 'children', title: 'title', key: 'key' },
  })
  replaceFields!: Record<string, any>;

  /**
   * 树形数据源数据
   */
  @Prop({
    type: Array,
    required: true,
  })
  dataSource!: any[];

  /**
   * 是否显示加载状态
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  loading!: boolean;

  /**
   * 节点前的icon
   */
  @Prop({
    type: String,
    default: 'file',
  })
  icon!: string;

  /**
   * 是否显示checkbox
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  checkable!: boolean;

  /**
   * 搜索时的间隔
   */
  @Prop({
    type: Number,
    default: 500,
  })
  debounce!: number;

  /**
   * 选中的节点key
   */
  @Prop({
    type: Array,
    default: [],
  })
  selectedKeys!: string[];

  /**
   * checkbox选中的节点key
   */
  @Prop({
    type: Array,
    default: [],
  })
  checkedKeys!: string[];

  /**
   * 是否弹出
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  pop!: boolean;

  /**
   * 是否显示
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 标题
   */
  @Prop({
    type: String,
    default: '选择',
  })
  title!: string;

  private expandedKeys: string[] = []; // 展开的节点key
  private autoExpandParent = true;

  private searchValue = ''; // 查询内容

  private dataList: any[] = []; // 拉平的数据源

  /**
   * 点击节点展开回调
   * @param expandedKeys 展开的唯一编号列表
   */
  private handleExpand(expandedKeys: string[]) {
    this.expandedKeys = expandedKeys;
    this.autoExpandParent = false;
  }

  private temps: any = {
    check: null,
    select: null,
  };

  /**
   * 初始化时转换数据源数据
   * @param data 节点列表数据，即每层及的列表
   * @param pId 上层的唯一编号
   * @param link 层级唯一编号链路
   * @param nameLink 层级名称链路
   */
  private transformData(data: any[], pId = '', link = '', nameLink = '') {
    for (let i = 0; i < data.length; i++) {
      const links = `${link}/${data[i][this.replaceFields.key]}`;
      const nameLinks = `${nameLink}/${data[i][this.replaceFields.title]}`;
      data[i] = {
        ...data[i],
        link: links,
        nameLink: nameLinks,
        scopedSlots: { title: this.replaceFields.title },
      };

      this.dataList.push({
        pId: pId,
        link: links,
        [this.replaceFields.key]: data[i][this.replaceFields.key],
        [this.replaceFields.title]: data[i][this.replaceFields.title],
      });

      if (data[i][this.replaceFields.children]) {
        this.transformData(
          data[i][this.replaceFields.children],
          data[i][this.replaceFields.key],
          links,
          nameLinks,
        );
      }
    }
  }

  created() {
    this.transformData(this.dataSource);
    this.handleChange = debounce(this.handleChange, this.debounce);
  }

  @Watch('dataSource')
  protected handleDataSourceChange() {
    this.transformData(this.dataSource);
  }

  /**
   * 输入框查询回调
   */
  private handleChange(e: any) {
    const value = e.target.value;
    const expandedKeys = this.dataList
      .map(item => {
        if (value.trim() == '') {
          return null;
        }

        if (item[this.replaceFields.title].indexOf(value) > -1) {
          const temps = item.link.split('/');
          return temps[temps.length - 2];
          // return this.getParentKey(item[this.replaceFields.key], this.dataSource);
        }

        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    Object.assign(this, {
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  /**
   * 根据指定的key获取节点所有数据
   * @param key 指定的key
   */
  public getKeyData(key: string, dataSource = this.dataSource): any {
    for (let i = 0; i < dataSource.length; i++) {
      const node = dataSource[i];
      if (node[this.replaceFields.key] == key) {
        return node;
      } else if (node[this.replaceFields.children]) {
        return this.getKeyData(key, node[this.replaceFields.children]);
      }
    }
  }

  /**
   * 查找需要展开的父级节点key
   * @param key
   * @param tree
   * @returns 节点key
   */
  private getParentKey(key: string, tree: any): string {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node[this.replaceFields.children]) {
        if (
          node[this.replaceFields.children].some(
            (item: any) => item[this.replaceFields.key] === key,
          )
        ) {
          parentKey = node[this.replaceFields.key];
        } else if (this.getParentKey(key, node[this.replaceFields.children])) {
          parentKey = this.getParentKey(key, node[this.replaceFields.children]);
        }
      }
    }

    return parentKey;
  }

  /**
   * 选择节点时，自定义回调事件
   * @param keys 选中的节点列表-唯一编码
   * @param dataRef 当前节点的数据对象
   */
  @Emit('select')
  protected handleSelect(keys: string[], dataRef: any) {}

  /**
   * 选中checkbox后的回调事件
   * @param keys 选中的额节点列表-唯一编码，不包括半选节点
   * @param dataRef 当前选中的节点数据 包含子数据
   */
  @Emit('check')
  protected handleCheck(keys: string[], dataRef: any) {}

  /**
   * 选中checkbox后的回调事件
   * @param keys 选中的额节点列表-唯一编码，不包括半选节点
   * @param dataRef 当前选中的节点数据 包含子数据
   */
  @Emit('ok')
  protected handleOk(data: any) {}

  /**
   * 更新选中的节点
   * @param val 选中的节点编号
   */
  @Emit('update:selectedKeys')
  protected updateSelectedKeys(val: string[]) {}

  /**
   * 更新弹出框显示状态
   */
  @Emit('update:visible')
  protected updateModalVisible(val: boolean) {}

  /**
   * 更新选中的checkbox节点
   * @param val 选中的节点编号
   */
  @Emit('update:checkedKeys')
  protected updateCheckedKeys(val: string[]) {}

  protected render() {
    const content = (
      <a-spin spinning={this.loading}>
        <a-input-search placeholder="请输入" onChange={this.handleChange} />
        <div class="tree-content">
          <a-tree
            blockNode
            checkable={this.checkable}
            checkedKeys={this.checkedKeys}
            replaceFields={this.replaceFields}
            expanded-keys={this.expandedKeys}
            selectedKeys={this.selectedKeys}
            treeData={this.dataSource}
            auto-expand-parent={this.autoExpandParent}
            onExpand={this.handleExpand}
            onCheck={(checkedKeys: any, e: any) => {
              this.updateCheckedKeys(checkedKeys);
              this.temps.check = {
                checkedKeys: checkedKeys,
                dataRef: e.node.dataRef,
              };
              !this.pop && this.handleCheck(checkedKeys, e.node.dataRef);
            }}
            onSelect={(selectedKeys: string[], e: any) => {
              this.updateSelectedKeys(selectedKeys);
              this.temps.select = {
                selectedKeys: selectedKeys,
                dataRef: e.node.dataRef,
              };
              !this.pop && this.handleSelect(selectedKeys, e.node.dataRef);
            }}
            scopedSlots={{
              [this.replaceFields.title]: (data: any) => {
                const temp = data[this.replaceFields.title];
                return temp.indexOf(this.searchValue) > -1 ? (
                  <span>
                    <a-icon type={this.icon} />
                    {temp.substr(0, temp.indexOf(this.searchValue))}
                    <span style="color: #f50">{this.searchValue}</span>{' '}
                    {temp.substr(temp.indexOf(this.searchValue) + this.searchValue.length)}
                    {this.$scopedSlots.count ? this.$scopedSlots.count(data) : null}
                  </span>
                ) : (
                  <span>
                    <a-icon type={this.icon} />
                    {temp}
                  </span>
                );
              },
            }}
          />
        </div>
      </a-spin>
    );

    return (
      <div class="component-tree-package">
        {this.pop ? (
          <a-modal
            wrapClassName="component-tree-package-pop"
            title={this.title}
            visible={this.visible}
            onOk={() => {
              this.handleOk(this.temps);
              this.updateModalVisible(false);
            }}
            onCancel={() => {
              this.updateModalVisible(false);
            }}
          >
            {content}
          </a-modal>
        ) : (
          content
        )}
      </div>
    );
  }
}
