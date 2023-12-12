import { Component, Prop, Emit, Model, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import debounce from 'lodash.debounce';
import { DropDownSelectSearch } from '@/apis/business';

export interface DropDownListOptions {
  value?: Array<string>;
  placeholder?: string;
  debounce?: number;
  autoSearch?: boolean;
  multiple?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  size?: string;
  width?: string;
  searchType?: string;
  count?: number;
  maxTagCount?: number;
  replaceFields?: Record<string, any>;
}

export interface Events {
  onChange: (data: any[]) => void;
}

@Component
export default class DropDownList extends tsx.Component<DropDownListOptions, Events> {
  @Model('change', { type: Array, default: () => [] }) value!: Array<string>;

  /**
   * 占位符内容
   */
  @Prop({
    type: String,
    default: '请选择',
  })
  placeholder!: string;

  /**
   * 搜索时的间隔
   */
  @Prop({
    type: Number,
    default: 500,
  })
  debounce!: number;

  /**
   * 初始化时是否自动搜索
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  autoSearch!: boolean;

  /**
   * 是否多选
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  multiple!: boolean;

  /**
   * 是否允许清除
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  allowClear!: boolean;

  /**
   * 是否禁用
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;

  /**
   * 大小
   */
  @Prop({
    type: String,
    default: 'default',
  })
  size!: string;

  /**
   * 宽度
   */
  @Prop({
    type: String,
    default: '100%',
  })
  width!: string;

  /**
   * 是否开启自定义远端搜索
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  filterfetch!: boolean;

  /**
   * 自定义远端搜索方法
   */
  @Prop({
    type: String,
    default: '',
  })
  fetchFun!: string;

  /**
   * 表单获取数据远端方法，需内置
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote!: Record<string, any>;

  /**
   * 搜索类型，默认人员列表
   * SysRole -> 系统角色
   * HrEmp -> 人员列表
   * HrPost -> 岗位列表
   * HrPosition -> 职位列表
   * HrRank -> 职级列表
   * HrGroup -> 工作组列表
   * WhsTask -> 任务列表
   */
  @Prop({
    type: String,
    default: 'HrEmp',
  })
  searchType!: string;

  /**
   * 搜索返回的数据条数
   */
  @Prop({
    type: Number,
    default: 10,
  })
  count!: number;

  /**
   * 多选时最多展示多少
   */
  @Prop({
    type: Number,
    default: 1,
  })
  maxTagCount!: number;

  /**
   * 替换字段，对应数据源数据
   */
  @Prop({
    type: Object,
    default: () => ({ label: 'name', key: 'id' }),
  })
  replaceFields!: Record<string, any>;

  /**
   * 选择改变回调
   * @param value 回调数据
   */
  @Emit('change')
  protected handleValueChange(value: any[]) {}

  private copyValue: any[] = []; // 初始化时copy的默认值

  private data: any = []; // 返回的数据源
  private fetching = false; // 是否加载中
  private lastFetchId = 0; // 拉取时的编号，为了处理临时情况

  created() {
    this.fetchUser = debounce(this.fetchUser, this.debounce);

    this.copyValue = this.value.map((item: any) => {
      return { label: item[this.replaceFields.label], key: item[this.replaceFields.key] };
    });

    this.data = JSON.parse(JSON.stringify(this.copyValue));

    this.autoSearch && this.fetchUser('');
  }

  @Watch('value')
  protected valueChange() {
    this.copyValue = this.value.map((item: any) => {
      return { label: item[this.replaceFields.label], key: item[this.replaceFields.key] };
    });
  }

  /**
   * 获取数据
   * @param value 搜索关键字
   */
  private fetchUser(value: any) {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.data = [];
    this.fetching = true;

    if (fetchId !== this.lastFetchId) return;
    if (this.filterfetch) {
      return new Promise((resolve: Function) => {
        this.remote[this.fetchFun]((data: any) => {
          this.data = data.map((item: any) => {
            return {
              label: item[this.replaceFields.label],
              key: item[this.replaceFields.key],
            };
          });
          resolve();
        }, value);
      });
    } else {
      (async () => {
        const res = await DropDownSelectSearch({
          entity: { type: this.searchType, keyword: value, takeCount: this.count },
        });

        if (res.code === 200) {
          const data = res.data.map((item: any) => {
            return {
              label: item[this.replaceFields.label],
              key: item[this.replaceFields.key],
            };
          });

          this.data = data;
          this.fetching = false;
        }
      })();
    }
  }

  /**
   * 选择回调
   * @param value 选中的数据
   */
  private handleChange(value: any) {
    this.copyValue = value;

    let callData: any = null;

    if (this.multiple) {
      callData = this.copyValue.map((item: any) => {
        return {
          [this.replaceFields.key]: item.key,
          [this.replaceFields.label]: item.label,
        };
      });
    } else {
      if (value) {
        callData = [
          {
            [this.replaceFields.key]: value.key,
            [this.replaceFields.label]: value.label,
          },
        ];
      } else {
        callData = [];
      }
    }

    this.handleValueChange(callData);
  }

  render() {
    return (
      <a-select
        mode={this.multiple ? 'multiple' : 'default'}
        show-search
        label-in-value
        allowClear={this.allowClear}
        default-active-first-option={false}
        value={this.copyValue}
        placeholder={this.placeholder}
        style={{ width: this.width }}
        filter-option={false}
        options={this.data}
        disabled={this.disabled}
        size={this.size}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        maxTagCount={this.maxTagCount}
      >
        {this.fetching && <a-spin slot="notFoundContent" size="small" />}
      </a-select>
    );
  }
}
