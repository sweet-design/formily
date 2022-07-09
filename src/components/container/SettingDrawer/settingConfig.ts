import { message } from 'ant-design-vue';
import themeColor from './themeColor';

const colorList = [
  {
    key: '拂晓蓝(默认)',
    color: '#1890FF',
  },
  {
    key: '薄暮',
    color: '#F5222D',
  },
  {
    key: '火山',
    color: '#FA541C',
  },
  {
    key: '日暮',
    color: '#FAAD14',
  },
  {
    key: '明青',
    color: '#13C2C2',
  },
  {
    key: '极光绿',
    color: '#52C41A',
  },
  {
    key: '极客蓝',
    color: '#2F54EB',
  },
  {
    key: '酱紫',
    color: '#722ED1',
  },
  {
    key: '暗黑',
    color: '#001529',
  },
  {
    key: '淡灰',
    color: '#bababa',
  },
  {
    key: '高级灰',
    color: '#848587',
  },
];

const updateTheme = (newPrimaryColor: string, loading = true) => {
  let hideMessage: Function = () => {};
  if (loading) {
    hideMessage = message.loading('正在切换主题！', 0);
  }
  themeColor.changeColor(newPrimaryColor).finally(() => {
    loading && hideMessage();
  });
};

const updateColorWeak = (colorWeak: boolean) => {
  const app = document.body.querySelector('#app');
  colorWeak ? app?.classList.add('colorWeak') : app?.classList.remove('colorWeak');
};

export { colorList, updateTheme, updateColorWeak };
