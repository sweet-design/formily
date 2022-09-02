import { isString, isArray } from 'lodash';
import dayjs from 'dayjs';

/**
 * 校验生成工具
 * @params config 单个字段配置全量数据
 * @params getLangResult 多语言获取函数
 * @params models 全局model对象
 * @params directModels 当前字段直属上级对象
 * @params path 当前字段路径
 */
export default (
  config: any,
  getLangResult: Function,
  models: Record<string, any>,
  directModels: Record<string, any>,
  path: string,
) => {
  const arr = [];

  if (config.fieldProperties.required) {
    arr.push({
      required: true,
      message: getLangResult(
        config.fieldProperties.requiredMessageLangKey,
        config.fieldProperties.requiredMessage,
      ),
      trigger: ['blur', 'change'],
    });
  }

  if (config.fieldProperties.validator) {
    if (isString(config.fieldProperties.validator)) {
      arr.push({
        type: config.fieldProperties.validator,
        message: getLangResult(
          config.fieldProperties.typeErrorMessageLangKey,
          config.fieldProperties.typeErrorMessage,
        ),
        trigger: ['blur', 'change'],
      });
    }

    if (isArray(config.fieldProperties.validator)) {
      config.fieldProperties.validator.forEach((item: any) => {
        if (item.strategy === 'self') {
          if (item.validator.trim() !== '') {
            arr.push({
              validator: Function('"use strict";return (' + item.validator.trim() + ')')()(
                dayjs,
                getLangResult,
                models,
                directModels,
                path,
              ),
              trigger: item.triggerType,
            });
          }

          if (item.format !== '') {
            arr.push({
              type: item.format,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }

          if (item.pattern !== '') {
            arr.push({
              pattern: item.pattern,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }

          if (item.len !== null) {
            arr.push({
              len: item.len,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }

          if (item.min !== null) {
            arr.push({
              validator: (rule: any, value: any, callback: Function) => {
                if (value.length > item.min || value > item.min) {
                  callback();
                }

                callback(getLangResult(item.messageLangKey, item.message));
              },
              trigger: item.triggerType,
            });
          }

          if (item.max !== null) {
            arr.push({
              validator: (rule: any, value: any, callback: Function) => {
                if (value.length < item.max || value < item.max) {
                  callback();
                }

                callback(getLangResult(item.messageLangKey, item.message));
              },
              trigger: item.triggerType,
            });
          }

          if (item.exclusiveMaximum !== null) {
            arr.push({
              max: item.exclusiveMaximum,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }

          if (item.exclusiveMinimum !== null) {
            arr.push({
              min: item.exclusiveMinimum,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }

          if (item.whitespace) {
            arr.push({
              whitespace: true,
              message: getLangResult(item.messageLangKey, item.message),
              trigger: item.triggerType,
            });
          }
        } else if (item.strategy === 'drive') {
          // 驱动校验
        }
      });
    }
  }

  return arr;
};
