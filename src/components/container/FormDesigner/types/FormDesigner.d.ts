import { CohoComponent } from './component';

export declare class FormDesigner extends CohoComponent {
  /**
   * basic field
   * @default ['input','textarea','number','radio','checkbox','time','date','rate','color','ddList','treeSelect','customSelector','select','switch','slider','text','button','html']
   */
  basicFields?: Array<string>;

  /**
   * advance field
   * @default ['blank','imgupload','editor','cascader','table']
   */
  advanceFields?: Array<string>;

  /**
   * layout field
   * @default ['grid']
   */
  layoutFields?: Array<string>;

  /**
   * is show upload button
   * @default false
   */
  upload?: boolean;

  /**
   * is show clear button
   * @default false
   */
  clearable?: boolean;

  /**
   * is show preview button
   */
  preview?: boolean;

  /**
   * is show generate json button
   * @default false
   */
  generateJson?: boolean;

  /**
   * is show generate code button
   * @default false
   */
  generateCode?: boolean;

  /**
   * remote function
   */
  remoteFuncs?: Record<string, any>;

  /**
   * plugins list
   */
  plugins?: Record<string, any>;

  /**
   * get page config infomation
   */
  getConfigData(): Record<string, any>;

  /**
   * set page config infomation
   * @param data config string
   */
  setConfigData(data: Record<string, any>): void;
}
