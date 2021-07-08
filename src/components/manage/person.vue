<template>
  <div id="person">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Imanage/Imanage_index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-form class="el-form">
        <el-form-item label-width="50px" label="简介" class="intro_input">
          <el-input v-model="intro" type="textarea" maxlength=100 :show-word-limit="true" rows=5></el-input>
        </el-form-item>
        <el-form-item class="intro_btn">
          <el-button type="primary" @click="saveIntro">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label-width="50px" label="账号" class="account_input">
          <el-input v-model="account"></el-input>
        </el-form-item>
        <el-form-item class="account_btn">
          <el-button type="primary" @click="saveAccount">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label-width="50px" label="密码" class="password_input">
          <el-input v-model="password"></el-input>
        </el-form-item>
        <el-form-item class="password_btn">
          <el-button type="primary" @click="savePsd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  name: 'Person',
  data () {
    return {
      intro: '',
      account: '',
      password: ''
    }
  },
  methods: {
    saveIntro: function () {
      this.$http({
        method: 'post',
        url: 'modifyPersonalInfo',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          info: this.intro
        }
      }).then(ret => {
        if (ret.data === '修改成功') {
          Notification({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    saveAccount: function () {
      this.$http({
        method: 'post',
        url: 'modifyAccount',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          info: this.account
        }
      }).then(ret => {
        if (ret.data === '修改成功') {
          Notification({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    savePsd: function () {
      this.$http({
        method: 'post',
        url: 'modifyPassword',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          info: this.password
        }
      }).then(ret => {
        if (ret.data === '修改成功') {
          Notification({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
      })
    }
  },
  mounted () {
    this.$http({
      method: 'get',
      url: 'getManagerInfo',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(ret => {
      if (ret.data.hint === '请求成功') {
        this.intro = ret.data.intro
        this.account = ret.data.account
        this.password = ret.data.password
      }
    })
  }
}
</script>

<style scoped>
  .el-card{
    height: 700px;
    background-color: #dddddd;
  }
  .intro_input{
    display: inline-block;
    height: 130px;
    width: 600px;
    margin-top: 50px;
  }
  .account_input{
    display: inline-block;
    height: 50px;
    width: 600px;
    margin-top: 30px;
  }
  .password_input{
    display: inline-block;
    height: 80px;
    width: 600px;
    margin-top: 30px;
  }
  .intro_btn{
    display: inline-block;
    margin-left:20px;
  }
 .account_btn{
   display: inline-block;
   margin-left:20px;
  }
  .password_btn{
    display: inline-block;
    margin-left:20px;
  }
</style>
