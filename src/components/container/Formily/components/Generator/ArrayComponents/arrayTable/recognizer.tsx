import { Component, Prop, Mixins } from 'vue-property-decorator';
import mixin from '../../../../utils/mixin';
import CreateFormItem from '../../CreateFormItem';
import defaultValueGenerator from '../../../../utils/defaultValueGenerator';

@Component
export default class Recognizer extends Mixins(mixin) {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  config!: any;

  /**
   * 当前控件配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  currentConfig!: any;

  /**
   * 动作响应池数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  actions!: any;

  /**
   * api接口数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  apis!: any;

  /**
   * 表单实例对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  form!: any;

  /**
   * 表单数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  models!: any;

  /**
   * 直属上层数据对象
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  directModels!: any;

  /**
   * 表单项实例，这里指自增表格的表单项实例
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  formItemInstance!: any;

  /**
   * 字段路径
   */
  @Prop({
    type: String,
    default: '',
  })
  path!: string;

  private scrollWidth = 0;

  created() {
    const fieldProperties = this.currentConfig.fieldProperties;

    // 初始化响应式数据模型
    if (!this.directModels[fieldProperties.name]) {
      this.$set(this.directModels, fieldProperties.name, defaultValueGenerator(this.currentConfig));
    }
  }

  mounted() {
    this.$nextTick(() => {
      const domNode: any = document.querySelector(`#s${this.currentConfig.key}`);
      this.scrollWidth = domNode?.getBoundingClientRect().width;
    });
  }

  /**
   * 转换table所需要的 columns 配置数据
   */
  get columns() {
    return this.currentConfig.componentProperties.list.map((item: any) => {
      return {
        title: item.componentProperties.title,
        dataIndex: item.fieldProperties.name,
        scopedSlots: { customRender: item.fieldProperties.name },
        key: item.key,
        width: item.componentProperties.width || 200,
        align: item.componentProperties.align,
        fixed: item.componentProperties.fixed,
        colType: item.componentProperties.colType,
        isContainerComponent: item.fieldProperties.isContainerComponent,
      };
    });
  }

  /**
   * 生成插槽对象
   */
  private scopedSlotsResult() {
    const slots: any = {};

    this.columns.forEach((obj: any) => {
      slots[obj.dataIndex] = (data: any, other: any, index: number) => {
        // 根据列的编号查询指定列下的配置数据
        const temp = this.currentConfig.componentProperties.list.find(
          (ele: any) => ele.key === obj.key,
        );

        if (obj.colType === 'index') {
          return index + 1;
        }

        if (obj.colType === 'opt') {
          return (
            <a-space>
              <a-icon
                type="up"
                onClick={() => {
                  const temps = this.directModels[this.currentConfig.fieldProperties.name];
                  if (temps.length === 1 || index === 0) return;
                  temps.splice(index - 1, 1, ...temps.splice(index, 1, temps[index - 1]));
                }}
              />
              <a-icon
                type="down"
                onClick={() => {
                  const temps = this.directModels[this.currentConfig.fieldProperties.name];
                  if (temps.length === index + 1) return;
                  temps.splice(index, 1, ...temps.splice(index + 1, 1, temps[index]));
                }}
              />
              <a-icon
                type="delete"
                onClick={() => {
                  this.directModels[this.currentConfig.fieldProperties.name].splice(index, 1);
                }}
              />
            </a-space>
          );
        }

        return temp.componentProperties.list.map((item: any) => {
          return (
            <CreateFormItem
              models={this.models}
              path={`${this.path}${this.currentConfig.fieldProperties.name}.${index}.${
                obj.isContainerComponent ? obj.dataIndex + '.' : ''
              }`}
              form={this.form}
              directModels={
                obj.isContainerComponent
                  ? this.directModels[this.currentConfig.fieldProperties.name][index][obj.dataIndex]
                  : this.directModels[this.currentConfig.fieldProperties.name][index]
              }
              actions={this.actions}
              apis={this.apis}
              config={this.config}
              currentConfig={item}
              key={item.key}
              formItemInstance={this.formItemInstance}
            />
          );
        });
      };
    });

    return slots;
  }

  render() {
    return (
      <div>
        <div class="formily-array-table-container" id={'s' + this.currentConfig.key}>
          <a-table
            columns={this.columns}
            rowKey={(record: any, index: number) => {
              return index;
            }}
            dataSource={this.directModels[this.currentConfig.fieldProperties.name]}
            bordered={this.currentConfig.componentProperties.bordered}
            showHeader={this.currentConfig.componentProperties.showHeader}
            tableLayout={this.currentConfig.componentProperties.tableLayout}
            pagination={false}
            size={this.currentConfig.componentProperties.size ?? this.config.size}
            scopedSlots={this.scopedSlotsResult()}
            scroll={{ x: this.scrollWidth }}
          ></a-table>
        </div>
        <div style="margin-top: 10px;">
          <a-button
            type="dashed"
            icon="plus"
            block
            onClick={() => {
              const temp: any = {};
              this.columns.forEach((item: any) => {
                if (item.isContainerComponent) {
                  temp[item.dataIndex] = {};
                }
              });

              this.directModels[this.currentConfig.fieldProperties.name].push(temp);
            }}
          >
            添加
          </a-button>
        </div>
      </div>
    );
  }
}
