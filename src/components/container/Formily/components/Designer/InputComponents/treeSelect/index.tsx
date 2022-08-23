import { Component, Prop, Mixins } from 'vue-property-decorator';
import { executeStr, createHash } from '../../../../utils/format';
import mixin from '@/components/container/Formily/utils/mixin';
import { isNull, isString, isArray, isUndefined } from 'lodash';
import options from '../../../../utils/chinaDivision';

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

    const componentProperties = this.config.componentProperties;

    // 选中值的标签值列表
    let temps = null;

    // 如果是多选模式
    if (componentProperties.treeCheckable) {
      // 完全受控或者标签值
      if (componentProperties.treeCheckStrictly || componentProperties.labelInValue) {
        try {
          temps = JSON.parse(defaultValue);
        } catch (e) {
          this.$message.error((e as any).message);
          return 'N/A';
        }
      } else {
        // 需要递归去找数据
        try {
          const transData = JSON.parse(defaultValue);
          temps = this.loopData(transData, true);
        } catch (e) {
          this.$message.error((e as any).message);
          return 'N/A';
        }
      }
    } else {
      temps = this.loopData(defaultValue, false);
    }

    return temps.map((item: any) => item.label).join(',');
  }

  /**
   * 在全量数据源下，根据选中节点的标识列表查找明细数据
   * @param selected 已选中的值
   * @param multi 是否为多选
   * @returns 选中项的 labelInValue 值
   */
  private loopData(
    selected: string | string[],
    multi: boolean,
  ): Array<{ label: string; value: string }> {
    const replaceField = this.config.componentProperties.replaceField;
    const title = replaceField.title;
    const value = replaceField.value;
    const children = replaceField.children;

    const temp = selected;

    const container: any = [];
    const recursion = (data: any[]) => {
      data.forEach((item: any) => {
        if (multi ? temp.includes(item[value]) : temp === item[value]) {
          container.push({ label: item[title], value: item[value] });
        } else {
          if (item[children] && item[children].length > 0) {
            recursion(item[children]);
          }
        }
      });
    };

    recursion(this.shadowData);

    return container;
  }

  /**
   * 根据替换字段需要转换的数据
   * 此处只处理静态数据，暂不支持动态数据
   */
  get shadowData() {
    const staticDatas = this.config.fieldProperties.staticDatas; // 静态数据
    const replaceField = this.config.componentProperties.replaceField; // 替换字段

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

  private datas = [
    {
      label: '上海市',
      value: '0-0',
      children: [
        {
          value: '0-0-1',
          label: '浦东新区',
        },
        {
          label: '闵行区',
          value: '0-0-2',
          children: [
            {
              label: '浦江镇',
              value: '0-0-2-1',
              children: [
                {
                  label: '东风村',
                  value: '0-0-2-1-1',
                },
              ],
            },
            {
              label: '黄糖镇',
              value: '0-0-2-2',
            },
          ],
        },
      ],
    },
    {
      label: '节点二',
      value: '0-1',
    },
  ];

  private dataList = [
    {
      id: '0-0',
      label: '上海市',
      pId: '0',
    },
    {
      id: '0-0-1',
      label: '浦东新区',
      pId: '0-0',
    },
    {
      label: '节点二',
      id: '0-1',
      pId: '0',
    },
  ];

  render() {
    const fieldProperties = this.config.fieldProperties;
    const componentProperties = this.config.componentProperties;
    const formConfig = this.allConfig.config;

    if (fieldProperties.pattern === 'readPretty') {
      return <div class="control-text">{this.transValue}</div>;
    }

    // 此处在生成器中不可存在，这里只是作为展示
    let previewValue = null;
    try {
      if (
        fieldProperties.defaultValue.dataType === 'text' &&
        fieldProperties.defaultValue.value.trim() !== ''
      ) {
        previewValue = fieldProperties.defaultValue.value;
      } else {
        if (fieldProperties.defaultValue.value.trim() !== '') {
          previewValue = JSON.parse(fieldProperties.defaultValue.value);
        }
      }
    } catch (e) {
      this.$message.error((e as any).message);
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
        treeData={fieldProperties.dataSource === 'staticData' ? this.shadowData : []}
        value={previewValue}
        allowClear={componentProperties.allowClear}
        labelInValue={componentProperties.labelInValue}
        showSearch={componentProperties.showSearch}
        treeCheckable={componentProperties.treeCheckable}
        treeDefaultExpandAll={componentProperties.treeDefaultExpandAll}
        dropdownMatchSelectWidth={componentProperties.dropdownMatchSelectWidth}
        showCheckedStrategy={componentProperties.showCheckedStrategy}
        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        treeNodeFilterProp={componentProperties.treeNodeFilterProp}
        treeNodeLabelProp={componentProperties.treeNodeLabelProp}
        maxTagCount={componentProperties.maxTagCount}
        filterTreeNode={filterTreeNode}
        treeDataSimpleMode={treeDataSimpleMode}
        treeCheckStrictly={componentProperties.treeCheckStrictly}
        dropdownStyle={{ maxHeight: `${componentProperties.listHeight}px` }}
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
