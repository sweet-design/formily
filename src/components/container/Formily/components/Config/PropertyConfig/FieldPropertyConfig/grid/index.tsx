import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlCenter from '../../../../ControlCenter';

@Component
export default class Grid extends Vue {
  /**
   * 所有配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  data!: any;

  /**
   * 当前选中的组件配置数据模型
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  // 缓存字段属性配置
  get fieldProperties() {
    return this.select.fieldProperties;
  }

  // 是否显示受控中心弹窗
  private controlVisible = false;

  render() {
    return (
      <div>
        <a-form-model
          props={{ model: this.fieldProperties }}
          label-col={{ span: 9 }}
          wrapper-col={{ span: 14, offset: 1 }}
          labelAlign="left"
        >
          <a-form-model-item
            label="字段标识"
            prop="name"
            key={this.select.key}
            rules={[
              {
                pattern: /^[a-z]+$/i,
                message: '只能使用英文字母',
              },
            ]}
          >
            <a-input vModel={this.fieldProperties.name} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="标题">
            <a-input vModel={this.fieldProperties.title} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="标题国际化标识">
            <a-input vModel={this.fieldProperties.titleLangKey} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-textarea autoSize vModel={this.fieldProperties.description} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="描述国际化标识">
            <a-input vModel={this.fieldProperties.descriptionLangKey} placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item
            scopedSlots={{
              label: () => {
                return (
                  <a-tooltip placement="left" title="半隐藏只会隐藏UI，全隐藏会删除数据">
                    展示状态
                  </a-tooltip>
                );
              },
            }}
          >
            <a-select vModel={this.fieldProperties.display}>
              <a-select-option value="visible">显示</a-select-option>
              <a-select-option value="hidden">半隐藏</a-select-option>
              <a-select-option value="none">全隐藏</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="受控中心">
            <a-button
              block
              onClick={() => {
                this.controlVisible = true;
              }}
            >
              受控配置
            </a-button>
          </a-form-model-item>
        </a-form-model>

        {/* 受控中心配置 */}
        {this.controlVisible && (
          <ControlCenter
            data={this.fieldProperties.reactions}
            id={this.select.key}
            removeStateList={['pattern', 'required', 'value', 'defaultValue']}
            onConfirm={(data: any) => {
              this.fieldProperties.reactions = data;
              this.controlVisible = false;
            }}
            onCancel={() => {
              this.controlVisible = false;
            }}
          />
        )}
      </div>
    );
  }
}
