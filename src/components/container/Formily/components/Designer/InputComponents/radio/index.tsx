import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isUndefined } from 'lodash';

@Component
export default class Radio extends Mixins(mixin) {
  /**
   * 单个字段配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  config!: any;

  /**
   * 组件所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  allConfig!: any;

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.config.fieldProperties;

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        const newValue = this.dataFactory();
        return executeStr(fieldProperties.valueFormatter, newValue);
      } catch (e) {
        this.$message.error((e as any).message);
        return 'N/A';
      }
    }

    return this.dataFactory();
  }

  /**
   * 数据工厂
   * @returns {string} 当前选中值的lable
   */
  private dataFactory(): string {
    const defaultValue = this.config.fieldProperties.defaultValue;

    if (
      (isString(defaultValue) && defaultValue.trim() === '') ||
      isNull(defaultValue) ||
      isUndefined(defaultValue)
    ) {
      return 'N/A';
    }

    return this.shadowData.find((item: any) => item.value === defaultValue).label;
  }

  // 根据替换字段需要转换的数据
  get shadowData() {
    const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
    const replaceField = this.config.componentProperties.replaceField; // 替换字段

    return staticDatas.map((item: any) => {
      return {
        ...item,
        label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
        value: item[replaceField.value],
      };
    });
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    return fieldProperties.pattern === 'readPretty' ? (
      <div class="control-text">{this.transValue}</div>
    ) : (
      <a-radio-group
        readOnly
        value={fieldProperties.defaultValue}
        size={componentProperties.size ?? formConfig.size}
        disabled={fieldProperties.pattern === 'disabled'}
        buttonStyle={componentProperties.buttonStyle}
      >
        {componentProperties.optionType === 'default'
          ? this.shadowData.map((item: any) => {
              return <a-radio value={item.value}>{item.label}</a-radio>;
            })
          : this.shadowData.map((item: any) => {
              return <a-radio-button value={item.value}>{item.label}</a-radio-button>;
            })}
      </a-radio-group>
    );
  }
}
