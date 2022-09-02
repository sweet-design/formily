import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { executeStr, isJSON } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isArray, isUndefined, isObject } from 'lodash';

@Component
export default class TreeSelect extends Mixins(mixin) {
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

  // 动态数据
  private dynamicDatas = [];

  // 阅读模式下数据转换显示，每种控件在阅读模式下在转换成显示值时所需要的函数是不同的
  get transValue() {
    const fieldProperties = this.config.fieldProperties;
    const newValue = this.dataFactory();

    if (!newValue) {
      return 'N/A';
    }

    if (fieldProperties.valueFormatter.trim() !== '') {
      try {
        return executeStr(fieldProperties.valueFormatter, newValue);
      } catch (e) {
        this.$message.error('格式化函数处理错误');
        return 'N/A';
      }
    }

    if (isArray(newValue)) {
      return newValue.map((item: any) => item.label).join(',') || 'N/A';
    }

    return newValue.label || 'N/A';
  }

  /**
   * 数据工厂
   * @returns {string} 当前选中值的lable
   */
  private dataFactory(): any {
    const defaultValue = this.config.fieldProperties.defaultValue.value;

    if (isNull(defaultValue) || (isString(defaultValue) && defaultValue.trim() === '')) return null;

    const componentProperties = this.config.componentProperties;

    // 如果是复选或者多选模式
    if (componentProperties.treeCheckable || componentProperties.multiple) {
      if (!isJSON(defaultValue)) return null;

      const temp = JSON.parse(defaultValue);

      if (!isArray(temp) || (isArray(temp) && temp.length === 0)) return null;

      // 完全受控或者标签值
      if (componentProperties.treeCheckStrictly || componentProperties.labelInValue) {
        return this.loopData(
          temp.map((item: any) => {
            return item.value || null;
          }),
          true,
        );
      } else {
        return this.loopData(temp, true);
      }
    } else {
      if (componentProperties.labelInValue) {
        if (!isJSON(defaultValue) || isUndefined(defaultValue.value)) return null;

        return this.loopData(defaultValue.value, false);
      } else {
        return this.loopData(defaultValue, false);
      }
    }
  }

  /**
   * 在全量数据源下，根据选中节点的标识或者标识列表查找明细数据
   * @param selected 已选中的值
   * @param multiple 是否为多选
   * @returns 选中项的 labelInValue 值
   */
  private loopData(
    selected: string | string[],
    multiple: boolean,
  ): Array<{ label: string; value: string }> {
    const replaceField = this.config.componentProperties.replaceField;
    const title = replaceField.title;
    const value = replaceField.value;
    const children = replaceField.children;

    const container: any = [];
    const recursion = (data: any[]) => {
      data.forEach((item: any) => {
        if (multiple ? selected.includes(item[value]) : selected === item[value]) {
          container.push({ label: item[title], value: item[value] });
        } else {
          if (item[children] && item[children].length > 0) {
            recursion(item[children]);
          }
        }
      });
    };

    recursion(this.shadowData);

    return multiple ? container : container[0];
  }

  /**
   * 根据替换字段需要转换的数据
   * 此处只处理静态数据，暂不支持动态数据
   */
  get shadowData() {
    if (this.config.fieldProperties.dataSource === 'staticData') {
      const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
      const replaceField = this.config.componentProperties.replaceField; // 替换字段

      const componentProperties = this.config.componentProperties; // 组件属性

      if (componentProperties.treeDataSimpleMode.dataType === 'boolean') {
        if (componentProperties.treeDataSimpleMode.value) {
          // 启用了简单格式的treeData，此处就是为了转换多语言
          return staticDatas.map((item: any) => {
            return {
              ...item,
              [replaceField.title]: this.getLangResult(
                item[replaceField.lang],
                item[replaceField.title],
              ),
            };
          });
        } else {
          // 不启用简单格式的treeData
          const trans = (data: any) => {
            return data.map((item: any) => {
              return {
                [replaceField.title]: this.getLangResult(
                  item[replaceField.lang],
                  item[replaceField.title],
                ),
                [replaceField.value]: item[replaceField.value],
                [replaceField.children]:
                  (item.children && item.children.length > 0 && trans(item.children)) || [],
              };
            });
          };

          return trans(staticDatas);
        }
      } else {
        if (componentProperties.treeDataSimpleMode.value.trim() !== '') {
          // 启用了简单格式的treeData，此处就是为了转换多语言
          return staticDatas.map((item: any) => {
            return {
              ...item,
              [replaceField.title]: this.getLangResult(
                item[replaceField.lang],
                item[replaceField.title],
              ),
            };
          });
        }

        return staticDatas;
      }
    } else {
      return this.dynamicDatas;
    }
  }

  // 预览值
  private previewValue: any = null;

  // 监听默认值变动
  @Watch('config.fieldProperties.defaultValue', { deep: true })
  private defaultValueChangeHandle() {
    this.updatePreviewValue();
  }

  // 监听组件开启多选状态的变动
  @Watch('config.componentProperties.multiple')
  private multipleChangeHandle(newValue: boolean) {
    if (!this.config.componentProperties.treeCheckable) {
      this.updatePreviewValue();
    }
  }

  // 监听组件开启复选状态的变动
  @Watch('config.componentProperties.treeCheckable')
  private treeCheckableChangeHandle(newValue: boolean) {
    this.updatePreviewValue();
  }

  // 监听是否为标签值的变动
  @Watch('config.componentProperties.labelInValue')
  private labelInValueChangeHandle(newValue: boolean) {
    const componentProperties = this.config.componentProperties;
    if (!(componentProperties.treeCheckable && componentProperties.treeCheckStrictly)) {
      this.updatePreviewValue();
    }
  }

  // 监听是否完全受控状态的变动
  @Watch('config.componentProperties.treeCheckStrictly')
  private treeCheckStrictlyChangeHandle(newValue: boolean) {
    const componentProperties = this.config.componentProperties;
    if (componentProperties.treeCheckable) {
      this.updatePreviewValue();
    }
  }

  created() {
    this.updatePreviewValue();
  }

  // 更新预览值
  private updatePreviewValue() {
    const defaultValue = this.config.fieldProperties.defaultValue;
    const componentProperties = this.config.componentProperties;

    if (
      isNull(defaultValue.value) ||
      (isString(defaultValue.value) && defaultValue.value.trim() === '')
    ) {
      this.previewValue = null;
      return;
    }

    if (componentProperties.treeCheckable || componentProperties.multiple) {
      if (defaultValue.dataType !== 'expression') {
        this.$message.error('请将默认值类型设置为表达式，再进行配置json格式数据', 5);
        this.previewValue = null;
        return;
      }

      if (!isJSON(defaultValue.value)) {
        this.$message.error('请设置正确的数据格式', 5);
        this.previewValue = null;
        return;
      }

      const temp = JSON.parse(defaultValue.value);

      if (!isArray(temp)) {
        this.$message.error('请设置正确的数据格式', 5);
        this.previewValue = null;
        return;
      }

      if (componentProperties.labelInValue || componentProperties.treeCheckStrictly) {
        // 对象数组
        for (let i = 0; i < temp.length; i++) {
          if (!isObject(temp[i])) {
            this.$message.error('请设置正确的数据格式', 5);
            this.previewValue = null;
            return;
          }
        }
      } else {
        // 字符串数组
        for (let i = 0; i < temp.length; i++) {
          if (isObject(temp[i])) {
            this.$message.error('请设置正确的数据格式', 5);
            this.previewValue = null;
            return;
          }
        }
      }

      this.previewValue = temp;
    } else {
      if (componentProperties.labelInValue) {
        if (defaultValue.dataType !== 'expression') {
          this.$message.error('请将默认值类型设置为表达式，再进行配置json格式数据', 5);
          this.previewValue = null;
          return;
        }

        if (!isJSON(defaultValue.value)) {
          this.$message.error('请设置正确的数据格式', 5);
          this.previewValue = null;
          return;
        }

        const temp = JSON.parse(defaultValue.value);

        if (!temp.value || isObject(temp.value)) {
          this.$message.error('请设置正确的数据格式', 5);
          this.previewValue = null;
          return;
        }

        this.previewValue = temp;
        return;
      }

      this.previewValue = defaultValue.value;
    }
  }

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    // 转换树过滤条件
    let filterTreeNode: any = true;
    try {
      if (componentProperties.filterTreeNode.dataType === 'boolean') {
        filterTreeNode = componentProperties.filterTreeNode.value ? undefined : false;
      } else {
        if (componentProperties.filterTreeNode.value.trim() !== '') {
          filterTreeNode = Function(
            '"use strict";return (' + componentProperties.filterTreeNode.value + ')',
          )();
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    // 转换简单数据模式
    let treeDataSimpleMode = false;
    try {
      if (componentProperties.treeDataSimpleMode.dataType === 'boolean') {
        treeDataSimpleMode = componentProperties.treeDataSimpleMode.value;
      } else {
        if (componentProperties.treeDataSimpleMode.value.trim() !== '') {
          treeDataSimpleMode = JSON.parse(componentProperties.treeDataSimpleMode.value);
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    // 转换默认展开的节点
    let treeDefaultExpandedKeys = undefined;
    try {
      if (componentProperties.treeDefaultExpandedKeys.trim() !== '') {
        treeDefaultExpandedKeys = JSON.parse(componentProperties.treeDefaultExpandedKeys);
      }
    } catch (e) {
      this.$message.error((e as any).message);
    }

    return (
      <a-tree-select
        treeData={this.shadowData}
        value={this.previewValue || undefined}
        allowClear={componentProperties.allowClear}
        labelInValue={componentProperties.labelInValue}
        showSearch={componentProperties.showSearch}
        multiple={componentProperties.multiple}
        treeCheckable={componentProperties.treeCheckable}
        treeDefaultExpandAll={componentProperties.treeDefaultExpandAll}
        dropdownMatchSelectWidth={componentProperties.dropdownMatchSelectWidth}
        treeCheckStrictly={componentProperties.treeCheckStrictly}
        showCheckedStrategy={componentProperties.showCheckedStrategy}
        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        treeNodeFilterProp={componentProperties.treeNodeFilterProp}
        treeNodeLabelProp={componentProperties.treeNodeLabelProp}
        filterTreeNode={filterTreeNode}
        treeDataSimpleMode={treeDataSimpleMode}
        dropdownStyle={{ maxHeight: `${componentProperties.listHeight}px` }}
        maxTagCount={componentProperties.maxTagCount || undefined}
        replaceFields={componentProperties.replaceField}
        size={componentProperties.size ?? formConfig.size}
        placeholder={this.getLangResult(
          componentProperties.placeholderLangKey,
          componentProperties.placeholder,
        )}
        searchPlaceholder={this.getLangResult(
          componentProperties.searchPlaceholderLangKey,
          componentProperties.searchPlaceholder,
        )}
      />
    );
  }
}
