<template>
    <div id="post">
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Imanage/Imanage_index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理文章</el-breadcrumb-item>
        <el-breadcrumb-item>发布</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="el-card">
        <el-input class="title_input" placeholder="请输入内容" v-model="title">
          <template slot="prepend">标题</template>
        </el-input>
        <el-select class="select" v-model="value" placeholder="请选择分类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="post_btn" @click="post">发布</el-button>
        <mavon-editor class="editor"
          ref=md
          v-model  = 'content'
          :box-shadow = 'true'
          :ishljs = 'true'
        />
      </el-card>
    </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  name: 'Post',
  data () {
    return {
      content: '',
      title: '',
      options: [{
        value: '前端',
        label: '前端'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }, {
        value: '生活',
        label: '生活'
      }],
      value: '',
      date: ''
    }
  },
  mounted () {},
  methods: {
    // 获取当前时间
    getNowFormatDate () {
      const date = new Date()
      const seperator1 = '-'
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      return year + seperator1 + month + seperator1 + strDate
    },
    post: function () {
      this.date = this.getNowFormatDate()
      const that = this
      that.$http({
        method: 'post',
        url: 'postBlog',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          title: that.title,
          tag: that.value,
          content: that.content,
          date: that.date
        }
      }).then(function (ret) {
        if (ret.data.hint === '发表成功') {
          Notification({
            title: '成功',
            message: '发表成功',
            type: 'success'
          })
          that.title = ''
          that.value = ''
          that.content = ''
          that.date = ''
        } else if (ret.data.hint === '发表失败') {
          Notification({
            title: '失败',
            message: '发表失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-card{
    height: 800px;
    background-color: #dddddd;
  }
.title_input{
  width: 750px;
}
.select{
  margin-left: 30px;
}
.post_btn{
  margin-left: 30px;
}
  .editor{
  margin-top: 30px;
  height: 700px;
}
</style>
