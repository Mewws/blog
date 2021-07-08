<template>
    <div id="login">
      <div id="login_box">
        <b>管理员登录</b>
        <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
          <!-- 用户名 -->
          <el-form-item prop="username">
          <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="el-icon-user-solid" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <!-- 按键 -->
          <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="goBackToHome">返回主页</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login: function () {
      this.$refs.loginFormRef.validate(valid => {
        if (valid === false) {
          Notification({
            title: '登录失败',
            message: '登录名和密码不能为空噢>_<'
          })
        } else {
          this.$http({
            method: 'post',
            url: 'Login',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          }).then(ret => {
            if (ret.data.state === 1) {
              this.$router.push({ name: 'Manage' })
            } else if (ret.data.state === 0) {
              Notification({
                title: '登录失败',
                message: '登录名或者密码错误！'
              })
            }
          })
        }
      })
    },
    goBackToHome () {
      this.$router.push({ name: 'Index' })
    }
  }
}
</script>

<style lang="less" scoped>
#login{
  height: 100%;
  background-image: url("../assets/img/d955b75fe4900b742c84dadf90b7e280.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
}
#login #login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
  text-align: center;
  padding: 10px 0;
}
.login_form {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
