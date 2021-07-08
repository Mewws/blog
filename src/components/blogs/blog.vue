<template>
    <div id="blog">
      <!--文章展示主体-->
      <div id="body">
        <div class="count"><b>当前共有{{blogCount}}篇博客</b></div>
        <div class="show_blog">
          <!--一篇单独文章-->
          <div class="show_blog_box" v-for="item in journals" :key="item.id">
            <div class="title_part"><span class="title"><h3>{{item.title}}</h3></span></div>
            <p class="content_part" @click="goToDetail(item._id)" v-html="getContentText(item.content)"></p>
            <div class="info_part">
              <span class="tag">分类：{{item.tag}}</span>
              <span class="date">发布时间：{{item.date}}</span>
            </div>
          </div>
        </div>
        <!--回到顶部-->
        <el-backtop :bottom="125">
          <div
            style="{
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #dddddd;
        border-radius: 8px;
      }"
          >
            UP
          </div>
        </el-backtop>
      </div>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
export default {
  name: 'Blog',
  data () {
    return {
      navigation: [
        { id: 1, value: '主页', path: 'home' },
        { id: 2, value: '日志', path: 'blog' },
        { id: 3, value: '留言', path: 'message' }
      ],
      journals: [],
      blogCount: 0
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
  mounted: function () {
    const that = this
    function getBlog () {
      that.$http({
        method: 'get',
        url: 'getAllBlogs'
      }).then(function (ret) {
        that.journals = ret.data
        that.blogCount = ret.data.length
      })
    }
    getBlog()
  }
}
</script>

<style scoped>
  #body{
    width: 100%;
    height: 100%;
    background-color: #dddddd;
  }
  #body .count{
    text-align: center;
    padding: 20px;
    }
  #body .show_blog{
    width: 900px;
    margin: auto;
    padding: 10px;
  }
  #body .show_blog .show_blog_box{
    padding: 10px;
    border-radius: 8px;
    background-color: white;
    margin: 30px 0;
  }
  #body .show_blog .show_blog_box .title_part{
    height: 40px;
    width: 800px;
    padding: 0 10px;
    margin: auto;
  }
  #body .show_blog .show_blog_box .content_part{
    height: 95px;
    width: 800px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    padding: 10px;
    margin: auto;
    cursor: pointer;
    color: gray;
  }
  #body .show_blog .show_blog_box .info_part{
    margin-top: 15px;
    width: 820px;
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
  }
  #body .show_blog .show_blog_box .info_part span{
    color: #008800;
    font-size: 14px;
  }
</style>
