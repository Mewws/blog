<template>
  <el-container class="manage">
    <!--头部-->
    <el-header class="el-header">
      <div><h1>博客后台管理</h1></div>
      <!--退出登录图标-->
      <el-tooltip :enterable="false" effect="dark" content="退出登录" placement="bottom">
        <div class="logout"><img src="../../assets/iconfonts/logout.png" @click="logout"/></div>
      </el-tooltip>
    </el-header>
    <!--主体-->
    <el-container>
      <!--导航栏-->
      <el-aside class="el-aside" width="300px">
        <el-menu router :default-active="activePath" class="el-menu" background-color="#DDDDDD" text-color="#000000" active-text-color="#0066cc">
          <el-submenu index='/Imanage'>
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>管理文章</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/Imanage/Imanage_index/edit">
                <i class="el-icon-edit"></i>
                <span>编辑</span>
              </el-menu-item>
              <el-menu-item index="/Imanage/Imanage_index/post">
                <i class="el-icon-s-promotion"></i>
                <span>发布</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/Imanage/Imanage_index/Imsg_manage">
            <i class="el-icon-chat-line-round"></i>
            <span slot="title">管理留言</span>
          </el-menu-item>
          <el-menu-item index="/Imanage/Imanage_index/person_info">
            <i class="el-icon-document"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Manage',
  data () {
    return {
      activePath: ''
    }
  },
  methods: {
    logout: function () {
      this.$router.push({ name: 'Login' })
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.activePath = route.path
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  .manage{
    height: 100%;
  }
  .el-header {
    background-color: #BBBBBB;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-header .logout img{
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
  .el-aside {
    background-color: #DDDDDD;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-aside .el-menu{
    border-right: none;
  }
  .el-main {
    background-color: #ffffff;
    color: #333;
  }
</style>
