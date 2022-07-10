import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import './index.less';
import { UserSelectorSearch, LoadTreeData } from '@/apis/business';
import uniqby from 'lodash.uniqby';
import PageTree from '@/components/container/Selector/PPTree';

@Component
export default class UserSelector extends Vue {
  /**
   * 是否显示
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  visible!: boolean;

  /**
   * 默认穿梭框数据
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  defaultValue!: any[];

  /**
   * 根据组织查询人员数据时所需要的额外的参数
   */
  @Prop({
    type: Object,
    default: () => ({ includeQuitEmp: true }),
  })
  orgSearchParams!: Record<string, any>;

  /**
   * 根据文本关键字查询人员数据时所需要的额外的参数
   */
  @Prop({
    type: Object,
    default: () => ({ includeQuitEmp: true }),
  })
  textSearchParams!: Record<string, any>;

  /**
   * 每次查询回来的人员数量 -1 全部 反之同理
   */
  @Prop({
    type: Number,
    default: -1,
  })
  takeCount!: number;

  @Emit('update:visible')
  protected updateVisible(newVal: any) {}

  @Emit('close')
  protected onClose(value: any) {}

  private userData: any = []; // 左侧穿梭框的人员列表数据，来自服务端
  private targetKeys: any = []; // 穿梭到右侧的人员编号，后期回调需要根据此编号过滤到人员对应的全量数据

  private treeData: any[] = [];

  async created() {
    if (this.defaultValue.length > 0) {
      this.userData = this.defaultValue.map((item: any) => ({
        ...item,
        key: item.id,
        title: item.name,
      }));
      this.targetKeys = this.defaultValue.map((item: any) => item.id);
    }
    const res = await LoadTreeData({
      entity: {
        treeType: '5',
        changeAdmin: 0,
        extLi: [],
      },
    });

    this.treeData = res.data.data;
  }

  // 加载树方法
  private loadTree(treeNode: any) {
    return new Promise((resolve: Function) => {
      if (treeNode.dataRef.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.dataRef.children = [
          { name: `${treeNode.eventKey}`, id: `${treeNode.eventKey}-0` },
          { name: `${treeNode.eventKey}`, id: `${treeNode.eventKey}-1` },
        ];
        this.treeData = [...this.treeData];
        resolve();
      }, 1000);
    });
  }

  /**
   * 根据组织编号查询组织下所对应的人员列表
   * @param value 组织编号
   */
  private searchUserOfOrg(value: string) {
    this.getData({
      ...{
        orgId: value,
        needPermission: true,
        takeCount: this.takeCount, // -1 所有人
      },
      ...this.orgSearchParams,
    });
  }

  /**
   * 根据搜索关键字查询人员数据
   * @param value 搜索关键字
   */
  private serachUserOfText(value: string) {
    this.getData({
      ...{
        keyword: value,
        needPermission: true,
        takeCount: this.takeCount, // -1 所有人
      },
      ...this.textSearchParams,
    });
  }

  /**
   * 获取人员数据
   * @param data 获取数据时需要的参数
   */
  private async getData(data: any) {
    const res = await UserSelectorSearch({ entity: data });

    if (res.code === 200) {
      const datas = [
        ...this.userData,
        ...res.data.map((item: any) => ({ ...item, key: item.id, title: item.name })),
      ];
      this.userData = uniqby(datas, 'key');
    } else {
      this.$message.error(res.msg);
    }
  }

  private replaceFields = { children: 'childNodes', title: 'text', key: 'id' };
  private loading = false;
  private selectedKeys: string[] = [];
  private checkedKeys: string[] = [];

  render() {
    return (
      <a-modal
        visible={this.visible}
        width={900}
        centered
        title="人员选择器"
        onOk={() => {
          this.updateVisible(false);

          this.onClose(
            this.userData.filter((item: any) => {
              return this.targetKeys.indexOf(item.id) >= 0;
            }),
          );
        }}
        onCancel={() => {
          this.updateVisible(false);
        }}
      >
        <div class="component-user-selector-wrap">
          <a-row type="flex">
            <a-col span={7} style="height: 100%; border: 1px solid #e8e8e8; border-radius: 2px;">
              <a-tabs
                default-active-key="1"
                tabBarGutter={0}
                tabBarStyle={{ textAlign: 'center', marginBottom: 0 }}
                size="small"
                onChange={() => {}}
              >
                <a-tab-pane key="1" tab="目录">
                  <div class="pane-overflow">
                    <div>
                      <PageTree
                        dataSource={this.treeData}
                        selectedKeys={this.selectedKeys}
                        replaceFields={this.replaceFields}
                        loading={this.loading}
                        checkedKeys={this.checkedKeys}
                        style="width: 100%; height: 100%;"
                        on={{
                          ['update:selectedKeys']: (val: string[]) => {
                            if (val.length === 0) return;
                            this.selectedKeys = val;
                            this.searchUserOfOrg(val[0]);
                          },
                          ['update:checkedKeys']: (val: any) => {
                            this.checkedKeys = val;
                          },
                          check: () => {},
                          select: () => {},
                        }}
                      />
                    </div>
                    {/* <div>
											<a-directory-tree
												expandAction={false}
												onSelect={(selectedKeys: string) => {
													this.searchUserOfOrg(selectedKeys[0]);
												}}
												replaceFields={{ title: 'text', key: 'id', children: 'childNodes' }}
												tree-data={this.treeData}
											/>
										</div> */}
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="搜索">
                  <div class="pane-overflow">
                    <div>
                      <a-input-search
                        placeholder="请输入人员姓名或编码"
                        onSearch={(value: string) => {
                          this.serachUserOfText(value);
                        }}
                      />
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-col>
            <a-col style="height: 100%;" span={16} offset={1}>
              <a-transfer
                rowKey={(item: any) => item.id}
                data-source={this.userData}
                show-search
                listStyle={{ height: '360px', width: '252px' }}
                filter-option={(inputValue: any, option: any) => {
                  return option.name.indexOf(inputValue) > -1;
                }}
                target-keys={this.targetKeys}
                titles={['待选项', '已选择']}
                render={(item: any) => {
                  return item.name;
                }}
                onChange={(targetKeys: Array<string>) => {
                  this.targetKeys = targetKeys;
                }}
              />
            </a-col>
          </a-row>
        </div>
      </a-modal>
    );
  }
}
