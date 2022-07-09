<template>
  <div class="user-list-wrapper">
    <span>{{ pageName }}</span>
    <a-input v-model="age" placeholder="请输入"></a-input>
    <a-button @click="handleClick">点击</a-button>
    <Upload :visible.sync="visible" @ok="handleOk" :fileList="fileList" />
    <a-select
      show-search
      placeholder="Select a person"
      option-filter-prop="value"
      style="width: 200px"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
      <a-select-option value="jack">
        夹克
      </a-select-option>
      <a-select-option value="lucy">
        露出
      </a-select-option>
      <a-select-option value="tom">
        檀木
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import Upload from '@/components/container/Upload';
export default {
  name: 'UserList',
  components: {
    Upload,
  },
  data: () => ({
    pageName: '用户列表',
    age: '',
    visible: false,
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-2',
        name: 'yyy.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    datas: [
      { label: '张三', value: 'zhangsan' },
      { label: '李四', value: 'lisi' },
    ],
  }),
  methods: {
    handleClick() {
      this.visible = true;
    },
    handleOk(data) {
      console.log(data);
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      console.log('输入值', input, option);
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
