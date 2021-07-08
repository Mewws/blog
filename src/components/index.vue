<template>
    <div id="index">
      <!--顶部导航栏-->
      <el-header id="header">
        <span class="blog_name">歪瓜的博客</span>
        <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#ffffff" text-color="#000000" active-text-color="#000000">
          <el-menu-item v-for="item in navigation" :key="item.id" :index="'/'+item.path" class="el-menu-item">{{item.value}}</el-menu-item>
        </el-menu>
        <!--登录图标-->
        <el-tooltip :enterable="false" effect="dark" content="管理员登录" placement="bottom">
          <div class="login_box">
            <router-link to="Login"><img class="login" src="../assets/iconfonts/login.png"/></router-link>
          </div>
        </el-tooltip>
      </el-header>
      <div id="body">
        <!--主体占位符-->
        <router-view></router-view>
      </div>
      <!-- 底部信息 -->
      <footer id="footer"></footer>
    </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      navigation: [
        { id: 1, value: '主页', path: 'home' },
        { id: 2, value: '日志', path: 'blog' },
        { id: 3, value: '留言', path: 'Imessage' }
      ],
      activeIndex: ''
    }
  },
  methods: {
  },
  watch: {
    $route: {
      handler: function (route) {
        this.activeIndex = route.path
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  #header{
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
  }
  #header .el-menu-demo{
    width: 400px;
  }
  #header .el-menu-demo .el-menu-item{
    font-size: 18px;
    width: 80px;
  }
  #header .blog_name{
    color: black;
    font-size: 30px;
    align-self: center;
  }  #header .login_box{
       width: 30px;
       cursor: pointer;
       align-self: center;
     }
  #header .login_box .login{
    height: 30px;
  }
  #footer{
    height: 80px;
    line-height: 120px;
    background-color: #ffffff;
  }
</style>
