<template>
  <div>
    <el-button @click="logoutbtn" type='info'>退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logoutbtn(){
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功！')
    }
  }
}
</script>

<style lang="less" scoped>

</style>