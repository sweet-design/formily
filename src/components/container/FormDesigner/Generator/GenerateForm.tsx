import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import GenerateFormItem from './GenerateFormItem';
import GenerateTable from './GenerateTable';
import GenerateButton from './GenerateButton';
import dayjs from 'dayjs';
import './index.less';

@Component
export default class GenerateForm extends Vue {
  /**
   * 表单json所有配置数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any;

  /**
   * 过滤表单项
   */
  @Prop({
    type: Array,
    default: () => [],
  })
  filterKeys!: Array<string>;

  /**
   * 表单获取数据远端方法，需内置
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: Record<string, any>;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  /**
   * 表单数据初始数据实体
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: any;

  /**
   * 表单控件是否以文本方式展示
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  type!: boolean;

  private models: any = {}; // 整个form表单数据模型，由this.value转换而来
  private rules: any = {}; // 整个form表单数据验证模型

  /**
   * 控件值改变后实时回调
   * @param value 字段值
   * @param field 字段名
   */
  @Emit('change')
  private inputChange(value: any, field: any) {
    return this.models;
  }

  created() {
    this.generateModle(this.data.list);
  }

  @Watch('data', { deep: true })
  private dataChange(newVal: any) {
    // this.generateModle(newVal.list);
  }

  @Watch('value', { deep: true })
  private valueChange(newVal: any) {
    this.models = { ...this.models, ...newVal };
  }

  $refs!: {
    generateForm: any;
  };

  static install: (Vue: Vue) => void;

  /**
   * 获取表单数据并校验
   * @param state 获取表单时是否需要校验
   * @returns 数据模型
   */
  public getData(state = true) {
    return new Promise((resolve, reject) => {
      if (state) {
        this.$refs.generateForm.validate((valid: boolean) => {
          if (valid) {
            resolve(this.models);
          } else {
            reject(new Error('错误').message);
          }
        });
      } else {
        resolve(this.models);
      }
    });
  }

  /**
   * 重置表单数据
   */
  public reset() {
    this.$refs.generateForm.resetFields();
  }

  /**
   * 获取表单项Vue实例对象
   */
  public getFormItemInstance(key: string) {
    return (this.$refs as any)[key];
  }

  /**
   * 移除表单项的校验结果
   */
  public clear(props?: Array<string> | string) {
    if (props) {
      this.$refs.generateForm.clearValidate(props);
    } else {
      this.$refs.generateForm.clearValidate();
    }
  }

  private executeStr(obj: string, data: any, par: any) {
    return Function('"use strict";return (' + obj + ')')()(data, par);
  }

  /**
   * 自定义验证器拼装
   * @param obj 控件配置对象
   * @returns 高级校验规则列表
   */
  private customValidator(obj: any): any[] {
    if (obj.options.advanceRuleType === 'drive') {
      // 驱动校验
      return [
        {
          validator: (rule: any, value: any, callback: Function) => {
            this.$refs.generateForm.validateField(obj.options.driveList);
            callback();
          },
          trigger: 'change',
        },
      ];
    } else if (obj.options.advanceRuleType == 'range') {
      // 范围校验

      if (obj.type == 'datetimerange' || obj.type == 'daterange') return [];

      if (obj.options.rangeRuleObj.unit === 'default') {
        // 简单的数值大小的检验
        return [
          {
            validator: (rule: any, value: any, callback: Function) => {
              switch (obj.options.rangeRuleObj.condition) {
                case '>': // 大于
                  {
                    if (
                      value - this.models[obj.options.rangeRuleObj.field] >
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '<': // 小于
                  {
                    if (
                      value - this.models[obj.options.rangeRuleObj.field] <
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '==': // 等于
                  {
                    if (
                      value - this.models[obj.options.rangeRuleObj.field] ==
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '>=': // 大于等于
                  {
                    if (
                      value - this.models[obj.options.rangeRuleObj.field] >=
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '<=': // 小于等于
                  {
                    if (
                      value - this.models[obj.options.rangeRuleObj.field] <=
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '-': // 取差
                  {
                    if (
                      Math.abs(value - this.models[obj.options.rangeRuleObj.field]) ==
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '+': // 求和
                  {
                    if (
                      value + this.models[obj.options.rangeRuleObj.field] ==
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '%': // 取模
                  {
                    if (
                      value % this.models[obj.options.rangeRuleObj.field] ==
                      obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
              }
            },
            trigger: 'change',
          },
        ];
      } else {
        // 时间校验 包括 分钟 小时 天 年
        return [
          {
            validator: (rule: any, value: any, callback: Function) => {
              switch (obj.options.rangeRuleObj.condition) {
                case '>': // 大于
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) > obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '<': // 小于
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) < obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '==': // 等于
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) == obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '>=': // 大于等于
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) >= obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '<=': // 小于等于
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) <= obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
                case '-': // 取差
                  {
                    if (
                      dayjs(value).diff(
                        dayjs(this.models[obj.options.rangeRuleObj.field]),
                        obj.options.rangeRuleObj.unit,
                      ) == obj.options.rangeRuleObj.target
                    ) {
                      callback();
                    } else {
                      callback(new Error(obj.options.rangeRuleObj.message));
                    }
                  }
                  break;
              }
            },
            trigger: 'change',
          },
        ];
      }
    } else if (obj.options.advanceRuleType === 'custom') {
      // 自定义校验
      return [
        {
          validator: Function('"use strict";return (' + obj.options.customRuleFunc + ')')()(
            dayjs,
            this.models,
            this.value,
            this.$i18n,
          ),
          trigger: 'change',
        },
      ];
    }

    return [];
  }

  /**
   * 生成数据实体，包括数据值，校验数据等，即将数据拉平
   * @param genList 表单配置数据
   */
  private generateModle(genList: Array<any>) {
    for (let i = 0; i < genList.length; i++) {
      if (genList[i].type === 'grid') {
        genList[i].columns.forEach((item: any) => {
          this.generateModle(item.list);
        });
      } else if (genList[i].type === 'table') {
        // table
      } else {
        if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
          this.models[genList[i].model] = this.value[genList[i].model];
        } else {
          if (genList[i].type === 'blank') {
            this.$set(
              this.models,
              genList[i].model,
              genList[i].options.defaultType === 'String'
                ? ''
                : genList[i].options.defaultType === 'Object'
                ? {}
                : [],
            );
          } else {
            // 如果没有在顶层初始值，将配置的默认值给到实体
            // 初始化生成器时，初始对象没有指定的key，将读取配置时默认值给到
            this.models[genList[i].model] = genList[i].options.defaultValue;
          }
        }

        if (this.rules[genList[i].model]) {
          this.rules[genList[i].model] = [
            ...this.rules[genList[i].model],
            ...genList[i].rules.map((item: any) => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) };
              } else if (item.required) {
                return {
                  ...item,
                  message: `${this.$t(genList[i].name)}${this.$t('component.check.null')}`,
                };
              } else {
                return {
                  ...item,
                  message: `${this.$t(genList[i].name)}${this.$t('component.check.format')}`,
                };
              }
            }),
            ...this.customValidator(genList[i]),
          ];
        } else {
          this.rules[genList[i].model] = [
            ...genList[i].rules.map((item: any) => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) };
              } else if (item.required) {
                return {
                  ...item,
                  message: `${this.$t(genList[i].name)}${this.$t('component.check.null')}`,
                };
              } else {
                return {
                  ...item,
                  message: `${this.$t(genList[i].name)}${this.$t('component.check.format')}`,
                };
              }
            }),
            ...this.customValidator(genList[i]),
          ];
        }
      }
    }
  }

  /**
   * 更新表单数据
   * @param value 表单实体数据
   */
  private updateModules(value: any) {
    this.models = value;
  }

  render() {
    return (
      <div class="generate-form-wrapper custom-horizontal-wrapper">
        <a-form-model
          ref="generateForm"
          props={{ model: this.models, rules: this.rules }}
          labelAlign={this.data.config.labelAlign}
          labelCol={{ span: this.data.config.labelCol }}
          wrapperCol={{ span: 24 - this.data.config.labelCol }}
        >
          {this.data.list.map((item: any, index: number) => {
            return item.type == 'grid' ? (
              <a-row
                key={index}
                type="flex"
                gutter={item.options.gutter ? item.options.gutter : 0}
                justify={item.options.justify}
                align={item.options.align}
              >
                {item.columns.map((sub: any, idx: number) => {
                  return (
                    <a-col key={idx} span={sub.span}>
                      {sub.list.map((obj: any) => {
                        return obj.type == 'button' ? (
                          <GenerateButton
                            ref={obj.model}
                            key={obj.key}
                            widget={obj}
                            data={this.models}
                            remote={this.remote}
                            globalConfig={this.data.config}
                          />
                        ) : obj.type == 'table' ? (
                          <GenerateTable
                            ref={obj.model}
                            key={obj.key}
                            widget={obj}
                            remote={this.remote}
                          />
                        ) : (
                          <GenerateFormItem
                            ref={obj.model}
                            key={obj.key}
                            value={this.value}
                            filterKeys={this.filterKeys}
                            type={this.type}
                            models={this.models}
                            on={{
                              ['update:models']: this.updateModules,
                            }}
                            remote={this.remote}
                            plugins={this.plugins}
                            globalConfig={this.data.config}
                            rules={this.rules}
                            widget={obj}
                            onInputChange={this.inputChange}
                            onChecked={(field: string) => {
                              this.$refs.generateForm.validateField(field);
                            }}
                          />
                        );
                      })}
                    </a-col>
                  );
                })}
              </a-row>
            ) : item.type == 'table' ? (
              <GenerateTable ref={item.model} key={item.key} widget={item} remote={this.remote} />
            ) : item.type == 'button' ? (
              <GenerateButton
                ref={item.model}
                key={item.key}
                widget={item}
                data={this.models}
                remote={this.remote}
                globalConfig={this.data.config}
              />
            ) : (
              <GenerateFormItem
                ref={item.model}
                key={item.key}
                value={this.value}
                filterKeys={this.filterKeys}
                type={this.type}
                models={this.models}
                on={{ ['update:models']: this.updateModules }}
                remote={this.remote}
                plugins={this.plugins}
                globalConfig={this.data.config}
                rules={this.rules}
                widget={item}
                onInputChange={this.inputChange}
                onChecked={(field: string) => {
                  this.$refs.generateForm.validateField(field);
                }}
              />
            );
          })}
        </a-form-model>
      </div>
    );
  }
}
