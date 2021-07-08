<template>
    <div id="home">
      <!-- 主体信息 -->
      <el-main id="body">
        <!-- 个人简介 -->
        <div id="info">
          <div class="portrait_box">
            <img src="../assets/img/006VAKOPly1gilc1u6gptj30u00u0nod.jpg" class="portrait"/>
          </div>
          <div class="info_box">
            <span>{{intro}}</span>
          </div>
        </div>
        <!-- 滚动日志框 -->
        <div id="show_box">
          <!-- 一篇日志 -->
          <el-carousel trigger="click" class="el-carousel">
            <el-carousel-item v-for="item in showJournals" :key="item.id" class="el-carousel-item">
              <div class="content_box">
                <div class="title">
                  <h2>{{item.title}}</h2>
                </div>
                <p class="content" @click="goToDetail(item._id)" v-html="getContentText(item.content)"></p>
                <div class="journal_info">
                  <span class="tag">分类：{{item.tag}}</span>
                  <span class="time">发布时间：{{item.date}}</span>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-main>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
export default {
  name: 'Home',
  data () {
    return {
      navigation: [
        { id: 1, value: '主页', path: 'home' },
        { id: 2, value: '日志', path: 'blog' },
        { id: 3, value: '留言', path: 'message' }
      ],
      showJournals: [],
      journalSize: '',
      intro: ''
    }
  },
  methods: {
    goToDetail: function (val) {
      this.$router.push({ name: 'Detail', params: { id: val } })
    },
    getContentText: function (value) {
      const a = mavonEditor.getMarkdownIt()
      const htmlContent = a.render(value)
      return htmlContent.replace(/<[^>]+>/g, '')
    }
  },
  created: function () {
    const that = this
    that.$http({
      method: 'get',
      url: 'getPersonalInfo'
    }).then(ret => {
      that.intro = ret.data
    })
    function getBlog () {
      that.$http({
        method: 'get',
        url: 'getAllBlogs'
      }).then(function (ret) {
        if (ret.data.length >= 3) {
          that.showJournals = ret.data.slice(0, 3)
        } else {
          that.showJournals = ret.data
        }
      })
    }
    getBlog()
  },
  mounted: function () {
  }
}
</script>

<style scoped>
  #body{
    height: 100%;
    background-color: #dddddd;
  }
#body #info{
  width: 860px;
  height: 300px;
  margin: auto;
  border-radius: 8px;
  background-color: white;
  padding: 20px;
}
#body #info .info_box{
  width: 700px;
  height: 100px;
  margin: 20px auto;
  padding: 10px;
  text-align: left;
}
.portrait_box{
  width: 150px;
  height: 150px;
  margin: 20px auto;
}
.portrait{
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: block;
  margin: auto;
}
#show_box{
  margin: auto;
  width: 920px;
  height: 430px;
  padding: 10px;
}
.el-carousel {
  height: 420px;
}
.el-carousel-item{
  height: 400px;
}
.content_box{
  width: 900px;
  height: 380px;
  margin: 10px auto;
  border-radius: 8px;
  background-color: white;
}
.content_box .title{
  padding-top: 10px;
  margin: 10px 10px;
  text-align: left;
  height: 50px;
}
.content_box .content{
  margin: auto;
  height: 190px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  overflow: hidden;
  cursor: pointer;
  padding: 20px;
  color: gray;
}
.journal_info{
  width: 800px;
  height: 30px;
  margin-top: 15px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}
.journal_info span{
  font-size: 14px;
  color: #008800;
}
</style>
