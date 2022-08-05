import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import classnames from 'classnames';
import TimePickerRange from '@/components/container/TimePickerRange';
import Dayjs from 'dayjs';
import './WidgetFormItem.less';

@Component
export default class WidgetFormItem extends Vue {
  /**
   * 单个字段配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  element!: any;

  /**
   * 当前选中的字段（基础，高级，布局）配置数据
   */
  @Prop({
    type: Object,
    default: () => {},
  })
  select!: any;

  /**
   * 插件列表
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  plugins!: Record<string, any>;

  /**
   * 当前字段在父层list下所在的索引
   */
  @Prop({
    type: Number,
    default: 0,
  })
  index!: number;

  /**
   * 字段的父级list的父级的对象数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any;

  /**
   * 最外层表单的配置数据，最顶层config数据
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  globalConfig!: any;

  private selectWidget = this.select;

  @Watch('select')
  protected selectChange(val: any) {
    this.selectWidget = val;
  }

  @Emit('update:select')
  protected updateSelect(newVal: any) {}

  @Watch('selectWidget', { deep: true })
  selectWidgetChange(newVal: any) {
    this.updateSelect(newVal);
  }

  /**
   * 切换选中字段并设置新的选中字段配置数据
   */
  handleSelectWidget(e: Event, index: number) {
    e.stopPropagation();
    this.selectWidget = this.data.list[index];
  }

  /**
   * 删除字段
   * @param index 组件索引
   */
  handleWidgetDelete(index: number) {
    this.$confirm({
      content: '确定删除吗？',
      onOk: () => {
        // 删除后 默认选中的规则：自己悟
        if (this.data.list.length - 1 === index) {
          if (index === 0) {
            this.selectWidget = {};
          } else {
            this.selectWidget = this.data.list[index - 1];
          }
        } else {
          this.selectWidget = this.data.list[index + 1];
        }

        this.$nextTick(() => {
          this.data.list.splice(index, 1);
          this.$message.success('删除成功');
        });
      },
    });
  }

  /**
   * 复制字段
   * @param index 字段索引
   */
  handleWidgetClone(index: number) {
    let cloneData = {
      ...this.data.list[index],
      options: { ...this.data.list[index].options },
      key: Dayjs().valueOf(),
    };

    cloneData = JSON.parse(JSON.stringify(cloneData));

    this.data.list.splice(index, 0, cloneData);

    this.$nextTick(() => {
      this.selectWidget = this.data.list[index + 1];
    });
  }

  private columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '12%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '30%',
      key: 'address',
    },
  ];

  private rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  render() {
    const element = this.element;
    return (
      <div
        class="widget-form-item"
        style={
          this.element.type === 'button'
            ? this.element.options.inline
              ? {
                  display: 'inline-block',
                  marginLeft: this.element.options.float == 'left' ? '0' : '10px',
                  marginRight: this.element.options.float == 'left' ? '10px' : '0',
                  float: this.element.options.float,
                }
              : {}
            : {}
        }
      >
        {this.element.type === 'button' ? (
          <div
            class={classnames('widget-view', {
              active: this.selectWidget.key == this.element.key,
            })}
            onClick={(e: Event) => {
              this.handleSelectWidget(e, this.index);
            }}
            style={{ textAlign: this.element.options.justify }}
          >
            {this.element.options.group ? (
              <a-dropdown>
                <a-menu slot="overlay">
                  {this.element.options.groupList.map((item: any, index: number) => {
                    return (
                      <a-menu-item key={index}>
                        {item.icon !== '' && <a-icon type={item.icon} />} {item.title}
                      </a-menu-item>
                    );
                  })}
                </a-menu>
                <a-button
                  style={element.options.customStyle}
                  disabled={element.options.disabled}
                  size={this.globalConfig.size}
                  type={element.options.type}
                  icon={element.options.icon}
                >
                  {this.element.title} <a-icon type="down" />
                </a-button>
              </a-dropdown>
            ) : (
              <a-button
                style={element.options.customStyle}
                disabled={element.options.disabled}
                size={this.globalConfig.size}
                type={element.options.type}
                icon={element.options.icon}
              >
                {this.element.title}
              </a-button>
            )}
          </div>
        ) : this.element.type === 'table' ? (
          <div
            class={classnames('widget-view', {
              active: this.selectWidget.key == this.element.key,
            })}
            onClick={(e: Event) => {
              this.handleSelectWidget(e, this.index);
            }}
          >
            <a-table
              rowKey={this.element.primaryKey}
              pagination={this.element.page ? this.element.pagination : false}
              scroll={{ x: this.element.width, y: this.element.height }}
              bordered={this.element.border}
              columns={this.element.columns}
              size={this.element.size}
              row-selection={this.element.showSelectCol ? this.element.rowSelection : null}
            />
          </div>
        ) : (
          <a-form-item
            class={classnames('widget-view', {
              active: this.selectWidget.key == this.element.key,
              is_required: this.element.options.required,
            })}
            label={this.element.type == 'button' ? null : this.$t(this.element.name)}
            props={
              this.element.options.labelControl
                ? {
                    labelCol: { span: this.element.options.labelCol },
                    wrapperCol: { span: 24 - this.element.options.labelCol },
                  }
                : null
            }
            nativeOnClick={(e: Event) => {
              this.handleSelectWidget(e, this.index);
            }}
          >
            {this.element.type == 'input' && (
              <a-input
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                placeholder={this.$t(element.options.placeholder)}
                disabled={element.options.disabled}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'textarea' && (
              <a-input
                type="textarea"
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                placeholder={this.$t(element.options.placeholder)}
                disabled={element.options.disabled}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'number' && (
              <a-input-number
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                disabled={element.options.disabled}
                step={element.options.step}
                min={element.options.min}
                max={element.options.max}
                precision={element.options.precision}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'treeSelect' && (
              <a-tree-select
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                disabled={element.options.disabled}
                show-search={element.options.filterable}
                tree-data-simple-mode
                multiple={element.options.multiple}
                treeCheckable={element.options.multiple}
                allowClear={element.options.clearable}
                treeData={[]}
                showCheckedStrategy={element.options.showCheckedStrategy}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'customSelector' && (
              <a-select
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                open={false}
                getPopupContainer={() => document.querySelector('.widget-form-item')}
                mode={element.options.multiple ? 'multiple' : 'default'}
                disabled={element.options.disabled}
                placeholder={this.$t(element.options.placeholder)}
                allowClear={element.options.clearable}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'ddList' && (
              <this.plugins.DropDownList
                vModel={element.options.defaultValue}
                multiple={element.options.multiple}
                style={{ width: element.options.width }}
                disabled={element.options.disabled}
                placeholder={this.$t(element.options.placeholder)}
                allowClear={element.options.clearable}
                searchType={element.options.searchType}
                searchParams={
                  element.options.searchParams && element.options.searchParams.trim() !== ''
                    ? JSON.parse(element.options.searchParams)
                    : {}
                }
                autoSearch={element.options.autoSearch}
                count={element.options.count}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'radio' && (
              <a-radio-group
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                disabled={element.options.disabled}
                size={this.globalConfig.size}
              >
                {element.options.options.map((item: any, index: number) => {
                  return (
                    <a-radio
                      style={{
                        display: element.options.inline ? 'inline-block' : 'block',
                      }}
                      value={item.value}
                      key={item.value + index}
                    >
                      {element.options.showLabel ? this.$t(item.label) : item.value}
                    </a-radio>
                  );
                })}
              </a-radio-group>
            )}
            {this.element.type == 'checkbox' && (
              <a-checkbox-group
                vModel={element.options.defaultValue}
                style={{ width: element.options.width }}
                disabled={element.options.disabled}
              >
                {element.options.options.map((item: any, index: number) => {
                  return (
                    <a-checkbox
                      style={{
                        display: element.options.inline ? 'inline-block' : 'block',
                      }}
                      value={item.value}
                      key={item.value + index}
                    >
                      {element.options.showLabel ? this.$t(item.label) : item.value}
                    </a-checkbox>
                  );
                })}
              </a-checkbox-group>
            )}

            {this.element.type == 'time' && !element.options.isRange && (
              <a-time-picker
                vModel={element.options.defaultValue}
                inputReadOnly={element.options.readonly}
                allowClear={element.options.clearable}
                disabled={element.options.disabled}
                hourStep={element.options.hourStep}
                minuteStep={element.options.minuteStep}
                secondStep={element.options.secondStep}
                placeholder={this.$t(element.options.placeholder)}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
              ></a-time-picker>
            )}

            {this.element.type == 'time' && element.options.isRange && (
              <TimePickerRange
                vModel={element.options.defaultValue}
                placeholder={[
                  this.$t(element.options.startPlaceholder),
                  this.$t(element.options.endPlaceholder),
                ]}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                hourStep={element.options.hourStep}
                minuteStep={element.options.minuteStep}
                secondStep={element.options.secondStep}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
              ></TimePickerRange>
            )}

            {this.element.type == 'date' && element.options.type == 'date' && (
              <a-date-picker
                vModel={element.options.defaultValue}
                placeholder={this.$t(element.options.placeholder)}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
              ></a-date-picker>
            )}

            {this.element.type == 'date' && element.options.type == 'year' && (
              <a-date-picker
                vModel={element.options.defaultValue}
                mode="year"
                placeholder={this.$t(element.options.placeholder)}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
                onPanelChange={(value: any) => {
                  element.options.defaultValue = value.format(element.options.format);
                }}
              ></a-date-picker>
            )}

            {this.element.type == 'date' && element.options.type == 'month' && (
              <a-date-picker
                vModel={element.options.defaultValue}
                mode="month"
                placeholder={this.$t(element.options.placeholder)}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
                onPanelChange={(value: any, mode: string) => {
                  element.options.defaultValue = value.format(element.options.format);
                }}
              ></a-date-picker>
            )}

            {this.element.type == 'date' && element.options.type == 'datetime' && (
              <a-date-picker
                vModel={element.options.defaultValue}
                show-time={{
                  format: element.options.format.split(' ')[1],
                  hourStep: element.options.hourStep,
                  minuteStep: element.options.minuteStep,
                  secondStep: element.options.secondStep,
                }}
                placeholder={this.$t(element.options.placeholder)}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
              ></a-date-picker>
            )}

            {this.element.type == 'date' && element.options.type == 'datetimerange' && (
              <a-range-picker
                vModel={element.options.defaultValue}
                show-time={{
                  format: element.options.format.split(' ')[1],
                  hourStep: element.options.hourStep,
                  minuteStep: element.options.minuteStep,
                  secondStep: element.options.secondStep,
                }}
                placeholder={[
                  this.$t(element.options.startPlaceholder),
                  this.$t(element.options.endPlaceholder),
                ]}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
              ></a-range-picker>
            )}

            {this.element.type == 'date' && element.options.type == 'daterange' && (
              <a-range-picker
                vModel={element.options.defaultValue}
                placeholder={[
                  this.$t(element.options.startPlaceholder),
                  this.$t(element.options.endPlaceholder),
                ]}
                inputReadOnly={element.options.readonly}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                size={this.globalConfig.size}
                format={element.options.format}
                valueFormat={element.options.format}
              ></a-range-picker>
            )}

            {this.element.type == 'select' && (
              <a-select
                vModel={element.options.defaultValue}
                placeholder={this.$t(element.options.placeholder)}
                mode={element.options.multiple ? 'multiple' : 'default'}
                disabled={element.options.disabled}
                showSearch={element.options.filterable}
                allowClear={element.options.clearable}
                style={{ width: element.options.width }}
                optionFilterProp="title"
                size={this.globalConfig.size}
              >
                {element.options.options.map((item: any) => {
                  return (
                    <a-select-option
                      key={item.value}
                      value={item.value}
                      title={element.options.showLabel ? this.$t(item.label) : item.value}
                    >
                      {element.options.showLabel ? this.$t(item.label) : item.value}
                    </a-select-option>
                  );
                })}
              </a-select>
            )}

            {this.element.type == 'switch' && (
              <a-switch
                vModel={element.options.defaultValue}
                disabled={element.options.disabled}
                size={this.globalConfig.size}
              />
            )}

            {this.element.type == 'html' && (
              <div domProps-innerHTML={element.options.defaultValue}></div>
            )}

            {this.element.type == 'text' && <span>{element.options.defaultValue}</span>}

            {this.element.type == 'imgupload' && (
              <this.plugins.Upload
                accept=".jpg,.png"
                showType="1"
                length={element.options.length}
                multiple={element.options.multiple}
                disabled={true}
                alise={this.$t(element.options.alise)}
                onSuccess={(data: any[]) => {
                  console.log(data);
                }}
              />
            )}

            {this.element.type == 'cascader' && (
              <a-cascader
                vModel={element.options.defaultValue}
                disabled={element.options.disabled}
                allowClear={element.options.clearable}
                fieldNames={element.options.props}
                placeholder={this.$t(element.options.placeholder)}
                style={{ width: element.options.width }}
                options={element.options.remoteOptions}
                size={this.globalConfig.size}
              ></a-cascader>
            )}
          </a-form-item>
        )}

        {this.selectWidget.key == element.key && [
          <div class="widget-view-action widget-col-action" style="top: 0; right: 56px;">
            <a-tooltip placement="right" title="删除组件">
              <a-icon
                type="delete"
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.handleWidgetDelete(this.index);
                }}
              />
            </a-tooltip>
          </div>,
          <div class="widget-view-action" style="top: 0; right: 28px;">
            <a-tooltip placement="right" title="复制组件">
              <a-icon
                type="copy"
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.handleWidgetClone(this.index);
                }}
              />
            </a-tooltip>
          </div>,
          <div class="widget-view-drag" style="top: 0; cursor: move;">
            <a-tooltip placement="right" title="拖拽排序">
              <a-icon type="drag" class="drag-widget" />
            </a-tooltip>
          </div>,
        ]}
      </div>
    );
  }
}
