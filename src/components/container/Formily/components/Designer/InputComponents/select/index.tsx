import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isArray, isUndefined, isNumber } from 'lodash';

@Component
export default class Select extends Mixins(mixin) {
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

    if (this.config.componentProperties.mode === 'multiple') {
      if (this.config.componentProperties.labelInValue) {
        const temp = JSON.parse(defaultValue); // 此处在生成器中不可存在，这里只是作为展示
        return temp.map((item: any) => item.label).join(',');
      } else {
        const temp = JSON.parse(defaultValue); // 此处在生成器中不可存在，这里只是作为展示
        const arr = this.shadowData.filter((item: any) => temp.includes(item.value));
        return arr.map((item: any) => item.label).join(',');
      }
    } else {
      if (this.config.componentProperties.labelInValue) {
        return defaultValue.label;
      } else {
        return this.shadowData.find((item: any) => item.value === defaultValue).label;
      }
    }
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

    // 此处在生成器中不可存在，这里只是作为展示
    const defaultValue = fieldProperties.defaultValue.value;
    let previewValue = null;
    try {
      if (isString(defaultValue) && defaultValue.trim() !== '') {
        previewValue =
          componentProperties.mode === 'multiple' ? JSON.parse(defaultValue) : defaultValue;
      }

      if (isNull(defaultValue) || isNumber(defaultValue)) {
        previewValue = defaultValue;
      }
    } catch (e) {
      this.$message.error('多选模式下，默认值转换错误，请配置默认值为JSON字符串类型');

      previewValue = [];
    }

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    return (
      <a-select
        readOnly
        mode={componentProperties.mode}
        value={previewValue || undefined}
        showSearch={componentProperties.showSearch}
        optionFilterProp="children"
        filterOption={componentProperties.filterOption.value}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        open={false}
        size={componentProperties.size ?? formConfig.size}
        allowClear={componentProperties.allowClear}
        disabled={fieldProperties.pattern === 'disabled'}
        options={this.shadowData}
      />
    );
  }
}
