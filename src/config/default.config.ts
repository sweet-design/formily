export default {
  lang: 'zh-CN',
  home: 'Analysis', // 主页路由
  homeType: '1', // 主页模式 0.读取home字段 1.读取权限菜单第一个
  iconfontUrl: '//at.alicdn.com/t/font_2362347_02605he5ian.js',
  localStorage: {
    namespace: 'coho_',
    name: 'ls',
    storage: 'local',
  },
  theme: {
    layout: 'side', // 布局模式 side 侧边菜单布局 top 顶部菜单布局 mix 混合菜单布局
    navTheme: 'dark', // 导航菜单风格 light 亮色菜单风格 dark 暗色菜单风格 realDark 全局暗色风格
    primaryColor: '#1890FF', // 主题色
    accordion: false, // 侧边栏菜单是否启用手风琴模式
    fixedHeader: true, // 是否固定头部
    fixSiderbar: true, // 是否固定侧边菜单
    headerHeight: 48, // 头部高度
    weak: false, // 是否色弱模式
  },
  title: 'Admin Pro',
  multiTab: false, // 是否启用多页签方式，此时默认路由页面全部启用缓存，在非启用多页签下 通过路由配置keepAlive设置指定页面是否启用缓存
  ajax: {
    type: 2, // 资源获取地址拼接方式， 1. 按照正常Url拼接 2.按照网关方式拼接
  },
  authConfig: {
    authority: process.env.VUE_APP_AUTHCENTER_DISCOVERY_URL,
  },
};
