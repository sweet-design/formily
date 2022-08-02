import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr, createHash } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isArray, isUndefined } from 'lodash';
import options from '../../../../utils/chinaDivision';

@Component
export default class Cascader extends Mixins(mixin) {
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
      isUndefined(defaultValue) ||
      this.config.fieldProperties.dataSource === 'dynamicData'
    ) {
      return 'N/A';
    }

    const replaceField = this.config.componentProperties.replaceField;

    const label = replaceField.label;
    const value = replaceField.value;
    const children = replaceField.children;

    // 此处在生成器中不可存在，这里只是作为展示
    const temp = JSON.parse(defaultValue);
    const container: any = [];
    const recursion = (data: any[]) => {
      const result = data.filter((item: any) => {
        return temp.includes(item[value]);
      })[0];

      container.push(result[label]);
      if (result[children] && result[children].length > 0) {
        recursion(result[children]);
      }
    };

    recursion(options);

    return this.displayRender({ labels: container });
  }

  // 根据替换字段需要转换的数据
  get shadowData() {
    const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
    const replaceField = this.config.componentProperties.replaceField; // 替换字段

    const trans = (data: any) => {
      return data.map((item: any) => {
        return {
          [replaceField.label]: this.getLangResult(
            item[replaceField.lang],
            item[replaceField.label],
          ),
          [replaceField.value]: item[replaceField.value],
          [replaceField.children]:
            (item.children && item.children.length > 0 && trans(item.children)) || [],
        };
      });
    };

    return trans(staticDatas);
  }

  // 缓存hash值作为key
  get createHash() {
    return createHash();
  }

  // 默认搜索过滤函数
  private defaultFilter({ labels, selectedOptions }: any) {
    return labels.join(' / ');
  }

  // 缓存自定义渲染函数
  get displayRender() {
    const componentProperties = this.config.componentProperties;

    if (componentProperties.displayRender.trim() !== '') {
      try {
        const func = Function('"use strict";return (' + componentProperties.displayRender + ')')();
        func({ labels: [], selectedOptions: [] });
        return func;
      } catch (e) {
        this.$message.error((e as any).message);
        return this.defaultFilter;
      }
    }

    return this.defaultFilter;
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    // 此处在生成器中不可存在，这里只是作为展示
    let previewValue = null;
    try {
      previewValue = JSON.parse(fieldProperties.defaultValue.value);
    } catch (e) {
      previewValue = [];
    }

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    const props = {
      placeholder: this.getLangResult(
        componentProperties.placeholderLangKey,
        componentProperties.placeholder,
      ),
      displayRender: this.displayRender,
      size: componentProperties.size ?? formConfig.size,
      allowClear: componentProperties.allowClear,
      disabled: fieldProperties.pattern === 'disabled',
      options: fieldProperties.dataSource === 'staticData' ? options : [],
      changeOnSelect: componentProperties.changeOnSelect,
      autoFocus: componentProperties.autoFocus,
      expandTrigger: componentProperties.expandTrigger,
      fieldNames: componentProperties.replaceField,
      notFoundContent: this.getLangResult(
        componentProperties.notFoundContentLangKey,
        componentProperties.notFoundContent,
      ),
      defaultValue: previewValue,
    };

    if (componentProperties.showSearch) {
      return (
        <a-cascader
          showSearch={{
            filter: (inputValue: string, path: any[]) => {
              return path.some((option: any) => {
                return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
              });
            },
          }}
          props={props}
          onChange={(value: any, selectedOptions: any) => {
            fieldProperties.defaultValue.value = JSON.stringify(value);
          }}
        />
      );
    }

    return (
      <a-cascader
        key={this.createHash}
        props={props}
        onChange={(value: any, selectedOptions: any) => {
          fieldProperties.defaultValue.value = JSON.stringify(value);
        }}
      />
    );
  }
}
