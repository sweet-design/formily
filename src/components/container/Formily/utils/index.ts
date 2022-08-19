/**
 * 动态插入cssstyle
 * @param code css code
 */
export const loadCssCode = (code: string, id: string) => {
  const style: any = document.createElement('style');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.id = id;
  try {
    // for Chrome Firefox Opera Safari
    style.appendChild(document.createTextNode(code));
  } catch (ex) {
    // for IE
    style.styleSheet.cssText = code;
  }
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
};
