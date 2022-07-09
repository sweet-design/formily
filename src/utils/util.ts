/**
 * 判断是否是ie浏览器
 * @returns 是否是IE
 */
export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s: string) => bw.indexOf(s) >= 0;
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}
