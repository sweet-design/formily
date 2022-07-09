import FormDesigner from './FormDesigner';
import GenerateForm from './Generator/GenerateForm';

FormDesigner.install = (Vue: any) => {
  if (typeof window !== 'undefined' && window.Vue && !Vue) {
    window.Vue = Vue;
  }

  Vue.component(FormDesigner.name, FormDesigner);
};

GenerateForm.install = (Vue: any) => {
  if (typeof window !== 'undefined' && window.Vue && !Vue) {
    window.Vue = Vue;
  }

  Vue.component(GenerateForm.name, GenerateForm);
};

export { FormDesigner, GenerateForm };

export default {
  FormDesigner,
  GenerateForm,
};
