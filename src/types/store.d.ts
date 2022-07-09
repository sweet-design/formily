interface StoreJsAPI {
  set(key: string, value: any, expire?: number): any;
}

declare const store: StoreJsAPI;

declare module 'store' {
  export = store;
}
