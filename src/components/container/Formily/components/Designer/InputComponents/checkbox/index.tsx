import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isArray, isUndefined } from 'lodash';
import { createHash } from '../../../../utils/format';

@Component
export default class Checkbox extends Mixins(mixin) {
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
    const defaultValue = this.config.fieldProperties.defaultValue.value;

    if (
      (isString(defaultValue) && defaultValue.trim() === '') ||
      isNull(defaultValue) ||
      (isArray(defaultValue) && defaultValue.length === 0) ||
      isUndefined(defaultValue)
    ) {
      return 'N/A';
    }

    const temp = JSON.parse(defaultValue); // 此处在生成器中不可存在，这里只是作为展示
    const arr = this.shadowData.filter((item: any) => temp.includes(item.value));
    return arr.map((item: any) => item.label).join(',');
  }

  // 根据替换字段需要转换的数据
  get shadowData() {
    const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
    const replaceField = this.config.componentProperties.replaceField; // 替换字段

    return staticDatas.map((item: any) => {
      return {
        ...item,
        label: this.getLangResult(item[replaceField.lang], item[replaceField.label]),
        // 此处是由于组件库用value作为key并且toString()，没有默认值会报错
        value: item[replaceField.value] || createHash(12),
      };
    });
  }

  render() {
    const fieldProperties = this.config.fieldProperties;

    // 此处在生成器中不可存在，这里只是作为展示
    let previewValue = null;
    try {
      previewValue = JSON.parse(fieldProperties.defaultValue.value);
    } catch (e) {
      previewValue = undefined;
    }

    return fieldProperties.pattern === 'readPretty' ? (
      <div class="control-text">{this.transValue}</div>
    ) : (
      <a-checkbox-group
        readOnly
        value={previewValue || undefined}
        disabled={fieldProperties.pattern === 'disabled'}
        options={this.shadowData}
      />
    );
  }
}
