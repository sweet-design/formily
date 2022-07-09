<template>
  <div class="user-manage-wrapper">
    <span>{{ pageName }}</span>
    <a-input v-model="age" placeholder="请输入"></a-input>
    <div>
      <a-button class="step_1">点击</a-button>
      <a-button id="step_2">点击</a-button>

      <div data-step="1" data-intro="这里是步骤1!">dasdasd</div>
      <div data-step="2" data-intro="这里是步骤2!">1111</div>
      <div data-step="3" data-intro="这里是步骤3!">dsadasdas</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserManage',
  data: () => ({
    pageName: '用户管理',
    age: '',
  }),
  mounted: function() {
    this.setGuide();
  },
  methods: {
    setGuide() {
      const steps = [
        {
          element: '.step_1',
          intro: '步骤1：对应class为.step_1的元素进行选择提示。',
          position: 'right',
        },
        {
          element: '#step_2',
          intro: '步骤2：对应Id为#step_2的元素进行选择提示。',
          position: 'left',
        },
      ];
      this.$intro()
        .setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          skipLabel: '跳过',
          doneLabel: '完成',
          showBullets: false,
          tooltipClass: 'lebron',
          highlightClass: 'zhulei',
        })
        .oncomplete(() => {
          // 点击结束按钮后执行的事件
        })
        .onexit(() => {
          // 点击跳过按钮后执行的事件
        })
        .start();
    },
  },
};
</script>
