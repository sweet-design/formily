export type TimeRangePickerModel = {
  fieldProperties: {
    type: string;
    name: string;
    title: string;
    titleLangKey: string;
    description: string;
    descriptionLangKey: string;
    display: string;
    pattern: string;
    valueFormatter: string;
    defaultValue: string;
    required: boolean;
    requiredMessage: string;
    requiredMessageLangKey: string;
    reactions: {
      dependencies: {
        source: string;
        property: string;
        name: string;
        type: string;
      }[];
      fulfill: {
        state: {
          required: string;
          pattern: string;
          display: string;
        };
      };
    };
    validator: string | ValidatorInterface[];
  };
  componentProperties: {
    size: string;
    allowClear: boolean;
    autoFocus: boolean;
    disabledHours: string;
    disabledMinutes: string;
    disabledSeconds: string;
    hideDisabledOptions: boolean;
    inputReadOnly: boolean;
    use12Hours: boolean;
    hourStep: number;
    minuteStep: number;
    secondStep: number;
    format: string;
    beginPlaceholder: string;
    beginPlaceholderLangKey: string;
    endPlaceholder: string;
    endPlaceholderLangKey: string;
    onChange: string;
    onFocus: string;
    onBlur: string;
  };
  decoratorProperties: {
    tooltip: string;
    tooltipLangKey: string;
    labelWidth: string;
    wrapperWidth: string;
    labelAlign: string;
    wrapperAlign: string;
    hideLabel: boolean;
    colon: boolean;
    layout: string;
    labelCol: number;
    wrapperCol: number;
    size: string;
    customClass: string;
  };
};

export type ValidatorInterface = {
  strategy: string;
  triggerType: string;
  driveList: string[];
  rangeRuleList: {
    fieldName: string;
    condition: string;
    target: number;
    unit: string;
    message: string;
    messageLangKey: string;
  }[];
  validator: string;
  message: string;
  messageLangKey: string;
  format: string;
  pattern: string;
  len: number | null;
  max: number | null;
  min: number | null;
  exclusiveMaximum: number | null;
  exclusiveMinimum: number | null;
  whitespace: boolean;
};

const TimeRangePickerModel: TimeRangePickerModel = {
  /**
   * ????????????
   */
  fieldProperties: {
    /**
     * @name ????????????
     * @description ???????????????
     * @type {string}
     * @default 'timeRangePicker'
     */
    type: 'timeRangePicker',
    /**
     * @name ????????????
     * @description ????????????????????????????????????
     * @type {string}
     * @default ''
     */
    name: '',
    /**
     * @name ??????
     * @description ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * @type {string}
     * @default '????????????'
     */
    title: '????????????',
    /**
     * @name ?????????????????????
     * @description ?????????????????????key????????????????????????
     * @type {string}
     * @default ''
     */
    titleLangKey: '',
    /**
     * @name ??????
     * @description ??????????????????????????????????????????
     * @type {string}
     * @default ''
     */
    description: '',
    /**
     * @name ?????????????????????
     * @description ?????????????????????key????????????????????????
     * @type {string}
     * @default ''
     */
    descriptionLangKey: '',
    /**
     * @name ????????????
     * @description ??????????????????????????? ??????--?????????(????????????UI)--?????????(???????????????)
     * @param {('visible', 'hidden', 'none')} - display ?????????????????????
     * @default 'visible'
     */
    display: 'visible',
    /**
     * @name UI??????
     * @description ?????????UI???????????????????????? ?????????--??????--??????--??????
     * @param {('editable', 'disabled', 'readOnly', 'readPretty')} - pattern ?????????UI????????????
     * @default 'editable'
     */
    pattern: 'editable',
    /**
     * @name ???????????????
     * @description ????????????????????????????????????
     * @default ''
     */
    valueFormatter: '',
    /**
     * @name ?????????
     * @description ??????????????????
     * @default ''
     */
    defaultValue: '',
    /**
     * @name ??????
     * @description ???????????????????????????onBlur?????????
     * @default false
     */
    required: false,
    /**
     * @name ??????????????????
     * @description ????????????????????????????????????????????????????????????????????????${title}????????????
     * @type {string}
     * @default ''
     */
    requiredMessage: '',
    /**
     * @name ???????????????????????????
     * @description ?????????????????????key????????????????????????
     * @type {string}
     * @default ''
     */
    requiredMessageLangKey: '',
    /**
     * @name ????????????
     * @description ???????????????????????????????????????
     */
    reactions: {
      dependencies: [
        {
          // ???????????????
          source: 'username',
          // ?????????????????????
          property: 'value',
          // ?????????
          name: 'usernameValue',
          // ????????????
          type: 'any',
        },
      ],
      fulfill: {
        // ????????????????????????????????????????????????
        state: {
          // ??????????????????
          required: '',
          // UI????????????
          pattern: '',
          // ??????????????????
          display: '',
        },
      },
    },
    /**
     * @name ????????????
     * @description ??????????????????????????????????????????(???????????????????????????????????????????????????)????????????????????????????????????
     * @type {('string' | Array.<Object>)} - ?????????????????????????????????????????????????????????????????????????????????????????????????????????(??????????????????)?????????????????????????????????????????????????????????????????????(??????????????????)
     * @param {Object[]} validator - ?????????????????????
     * @param {('self', 'drive', 'range')} validator[].strategy - ????????????-----?????????????????????--????????????--???????????? @default 'self'
     * @param {('onInput', 'onFocus', 'onBlur')} validator[].triggerType - ????????????-----??????????????????--?????????--????????? @default ''
     *
     * @description ???????????????????????? validator[].strategy == 'drive'?????????
     * @param {Array.<string>} validator[].driveList - ??????????????????-----???????????????????????????????????????????????????????????? @default []
     *
     * @description ???????????????????????? validator[].strategy == 'range'?????????
     * @param {object[]} validator[].rangeRuleList - ????????????-----?????????????????????????????? @default []
     * @param {string} validator[].rangeRuleList[].fieldName - ?????????-----???????????????????????????????????? @default ''
     * @param {('>', '<', '==', '>=', '<=', '!=', '-', '+', '%')} validator[].rangeRuleList[].condition - ????????????-----?????????????????????????????????????????????????????????--??????--??????--????????????--????????????--??????--??????--??????--?????? @default ''
     * @param {number} validator[].rangeRuleList[].target - ?????????-----???????????????????????????????????????????????? @default null
     * @param {('default', 'minute', 'hour', 'day', 'week', 'month', 'years')} validator[].rangeRuleList[].unit - ??????-----????????????????????????????????????(???????????????????????????)--??????--??????--???--???--???--??? @default 'default'
     * @param {string} validator[].rangeRuleList[].message - ????????????-----?????????????????????????????? @default ''
     * @param {string} validator[].rangeRuleList[].messageLangKey - ???????????????????????????-----?????????????????????key???????????????????????? @default ''
     *
     * @description ????????????????????? validator[].strategy == 'self'?????????
     * @param {string} validator[].validator - ??????????????????-----???????????????????????? @default ''
     * @param {string} validator[].message - ????????????-----?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? @default ''
     * @param {string} validator[].messageLangKey - ???????????????????????????-----?????????????????????key???????????????????????? @default ''
     * @param {string} validator[].format - ????????????-----???????????????????????????validator????????????????????? @default ''
     * @param {string} validator[].pattern - ???????????????-----???????????????????????????????????? @default ''
     * @param {number|null} validator[].len - ????????????-----???????????????????????????????????? @default null
     * @param {number|null} validator[].max - ??????/????????????-----???????????????????????????????????????????????? @default null
     * @param {number|null} validator[].min - ??????/????????????-----???????????????????????????????????????????????? @default null
     * @param {number|null} validator[].exclusiveMaximum - ??????/??????????????????-----???????????????????????????????????????????????????????????? @default null
     * @param {number|null} validator[].exclusiveMinimum - ??????/??????????????????-----???????????????????????????????????????????????????????????? @default null
     * @param {boolean} validator[].whitespace - ??????????????????-----????????????????????????????????? @default false
     * @default ''
     */
    validator: '',
  },
  /**
   * ????????????
   */
  componentProperties: {
    /**
     * @name ??????
     * @type {string}
     * @param {('large', 'default', 'small')} size - ????????????????????????
     * @default 'default'
     */
    size: 'default',
    /**
     * @name ??????????????????
     * @type {boolean}
     * @default false
     */
    allowClear: false,
    /**
     * @name ??????????????????
     * @description ??????????????????????????????
     * @type {boolean}
     * @default false
     */
    autoFocus: false,
    /**
     * @name ????????????
     * @description ???????????????????????????????????????
     * @type {string}
     * @default ''
     */
    disabledHours: '',
    /**
     * @name ????????????
     * @description ???????????????????????????????????????
     * @type {string}
     * @default ''
     */
    disabledMinutes: '',
    /**
     * @name ?????????
     * @description ????????????????????????????????????
     * @type {string}
     * @default ''
     */
    disabledSeconds: '',
    /**
     * @name ??????????????????
     * @description ???????????????????????????
     * @type {boolean}
     * @default false
     */
    hideDisabledOptions: false,
    /**
     * @name ???????????????
     * @description ?????????????????????
     * @type {boolean}
     * @default false
     */
    inputReadOnly: false,
    /**
     * @name 12?????????
     * @description ????????????12?????????
     * @type {boolean}
     * @default false
     */
    use12Hours: false,
    /**
     * @name ????????????
     * @description ?????????????????????
     * @type {number}
     * @default 1
     */
    hourStep: 1,
    /**
     * @name ????????????
     * @description ?????????????????????
     * @type {number}
     * @default 1
     */
    minuteStep: 1,
    /**
     * @name ?????????
     * @description ??????????????????
     * @type {number}
     * @default 1
     */
    secondStep: 1,
    /**
     * @name ??????
     * @description ???????????????
     * @type {string}
     * @default 'HH:mm:ss'
     */
    format: 'HH:mm:ss',
    /**
     * @name ??????????????????
     * @type {string}
     * @default ''
     */
    beginPlaceholder: '',
    /**
     * @name ?????????????????????????????????
     * @type {string}
     * @default ''
     */
    beginPlaceholderLangKey: '',
    /**
     * @name ??????????????????
     * @type {string}
     * @default ''
     */
    endPlaceholder: '',
    /**
     * @name ?????????????????????????????????
     * @type {string}
     * @default ''
     */
    endPlaceholderLangKey: '',
    /**
     * @name ????????????
     * @description ??????????????????????????????????????????????????????formModel??????actions
     * @type {string}
     * @default ''
     */
    onChange: '',
    /**
     * @name ??????????????????
     * @description ??????????????????????????????????????????????????????formModel??????actions
     * @type {string}
     * @default ''
     */
    onFocus: '',
    /**
     * @name ??????????????????
     * @description ??????????????????????????????????????????????????????formModel??????actions
     * @type {string}
     * @default ''
     */
    onBlur: '',
  },
  // ????????????
  decoratorProperties: {
    /**
     * @name ??????
     * @type {string}
     * @default ''
     */
    tooltip: '',
    /**
     * @name ?????????????????????
     * @type {string}
     * @default ''
     */
    tooltipLangKey: '',
    /**
     * @name ????????????
     * @description ???????????????????????????????????????????????? px???%???vh???em??????auto
     * @type {string}
     * @default 'auto'
     */
    labelWidth: 'auto',
    /**
     * @name ????????????
     * @description ???????????????????????????????????????????????? px???%???vh???em??????auto
     * @type {string}
     * @default 'auto'
     */
    wrapperWidth: 'auto',
    /**
     * @name ??????????????????
     * @param {('right', 'left')} labelAlign - ?????????????????????
     * @type {string}
     * @default 'right'
     */
    labelAlign: 'right',
    /**
     * @name ??????????????????
     * @param {('right', 'left')} wrapperAlign - ?????????????????????
     * @type {string}
     * @default 'left'
     */
    wrapperAlign: 'left',
    /**
     * @name ??????????????????
     * @description ??????????????????????????????
     * @type {boolean}
     * @default false
     */
    hideLabel: false,
    /**
     * @name ???????????????
     * @type {boolean}
     * @default true
     */
    colon: true,
    /**
     * @name ????????????
     * @description ????????????--????????????--????????????
     * @type {string}
     * @param {('horizontal', 'vertical', 'inline')} layout - ?????????????????????
     */
    layout: 'horizontal',
    /**
     * @name ??????????????????
     * @description ??????24???????????????????????????????????????????????????????????????24????????????????????????????????????????????????????????????auto???????????????????????????
     * @type {number}
     * @default 6
     */
    labelCol: 6,
    /**
     * @name ??????????????????
     * @description ??????24???????????????????????????????????????????????????????????????24????????????????????????????????????????????????????????????auto???????????????????????????
     * @type {number}
     * @default 18
     */
    wrapperCol: 18,
    /**
     * @name ??????
     * @type {string}
     * @param {('large', 'default', 'small')} size - ????????????????????????
     * @default 'default'
     */
    size: 'default',
    /**
     * @name ???????????????
     * @description ???className???????????????style????????????
     * @type {string}
     * @default ''
     */
    customClass: '',
  },
};

export default TimeRangePickerModel;
