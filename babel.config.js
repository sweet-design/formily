module.exports = {
  env: {
    development: {
      sourceMaps: true,
      retainLines: true,
    },
  },
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
  plugins: [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]],
};
