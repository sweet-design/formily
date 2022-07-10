module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order'],
  ignore: ['selectors-within-list'],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['for', 'mixin', 'include'],
      },
    ],
    'no-invalid-double-slash-comments': true,
    'unit-whitelist': ['px', 'em', 'vh', 'rem', '%', 's', 'deg'],
    'string-quotes': 'single',
    'max-empty-lines': [
      2,
      {
        message: '最大空行为2行，大于2行保存会自动格式化',
      },
    ],
    'color-hex-case': [
      'lower',
      {
        message: '小写字母更容易与数字区分，16进制颜色值字母建议采用小写',
      },
    ],
    'color-hex-length': [
      'long',
      {
        message: '16进制颜色值不建议简写，请写全',
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'no-descending-specificity': null,
  },
};
