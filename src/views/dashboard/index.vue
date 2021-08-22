<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <div class="text">欢迎来到迦悦后台</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  position: relative;
  .text { 
    height: 60px;
    background-image: -webkit-linear-gradient(left,rgb(47, 161, 223),#66ffff 10%,#f3d83a 20%,#df8715 30%, #CCCCFF 40%, #00FFFF 50%,#CCCCFF 60%,#f3d83a 70%,#df8715 80%,#66FFFF 90%,rgb(47, 161, 223) 100%);
    -webkit-text-fill-color: transparent;/* 将字体设置成透明色 */
    -webkit-background-clip: text;/* 裁剪背景图，使文字作为裁剪区域向外裁剪 */
    -webkit-background-size: 200% 100%; 
    -webkit-animation: masked-animation 30s linear infinite;
    font-size: 35px;
    font-weight: bold;
  }
}

@keyframes masked-animation {
  0% {
    background-position: 0  0;
  }
  100% {
    background-position: -100%  0;
  }
}
</style>
