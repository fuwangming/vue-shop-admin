<template>
  <el-container class="home_container">
    <!-- 头布局 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpeg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logoutbtn" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/' + subItem.path" 
            v-for="subItem in item.children" 
            :key="subItem.id"
            @click="saveNavState('/' + subItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      // 左侧菜单数据
      menulist: [],
      iconObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-management',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      // 是否折叠
      isCollapse : false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    logoutbtn() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.success("退出成功！");
    },
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 8px;
    }
  }
}
.el-aside {
  background-color: #333744;
  color: #fff;
  .el-menu{
  border-right: 0;
}
}
.el-main {
  background-color: #eaedf1;
  color: red;
}
img {
  width: 60px;
  height: 60px;
}

.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>