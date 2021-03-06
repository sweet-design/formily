import client from 'webpack-theme-color-replacer/client';
import generate from '@ant-design/colors/lib/generate';

export default {
  getAntdSerials(color: string) {
    // 淡化（即less的tint）
    const lightens = new Array(9).fill(undefined).map((t, i) => {
      return client.varyColor.lighten(color, i / 10);
    });

    // colorPalette变换得到颜色值
    const colorPalettes = generate(color);
    const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',');
    return lightens.concat(colorPalettes).concat(rgb);
  },
  changeColor(newColor: string) {
    const options = {
      newColors: this.getAntdSerials(newColor),
      changeUrl(cssUrl: string) {
        return `/${cssUrl}`;
      },
    };
    return client.changer.changeColor(options, Promise);
  },
};
