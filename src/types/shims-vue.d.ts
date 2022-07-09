declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.less' {
  const less: any;
  export default less;
}

declare module '*.json' {
  const value: any;
  export default value;
}
