<template>
    <div id="detail">
      <!--头部区域-->
      <el-header id="header">
        <span class="blog_name">歪瓜的博客</span>
        <el-menu router default-active="/blog" class="el-menu-demo" mode="horizontal" background-color="#FFFFFF" text-color="#000000" active-text-color="#000000">
          <el-menu-item v-for="item in navigation" :key="item.id" :index="'/'+item.path" class="el-menu-item">{{item.value}}</el-menu-item>
        </el-menu>
        <!--登录图标-->
        <el-tooltip :enterable="false" effect="dark" content="管理员登录" placement="bottom">
          <div class="login_box">
            <router-link to="Login"><img class="login" src="../../assets/iconfonts/login.png"/></router-link>
          </div>
        </el-tooltip>
      </el-header>
      <!--主体-->
      <div id="body">
        <!--文章主体-->
        <div class="show_detail">
          <!--装文章详情的盒子-->
          <div class="detail_box">
            <!--返回上一页导航-->
            <div class="detail_navigation">
              <el-page-header @back="goBackToBlog" content="详情页面">
              </el-page-header>
            </div>
            <div class="detail_title"><h2>{{title}}</h2></div>
            <mavon-editor class="detail_content"
              :value="content"
              :subfield="false"
              :boxShadow="true"
              defaultOpen="preview"
              :toolbarsFlag="false"
              :navigation="false"
              :editable="false"
              :ishljs="true"
            />
            <!--文章相关信息-->
            <div class="detail_info">
              <span class="info_tag">分类：{{tag}}</span>
              <span class="info_date">{{date}}</span>
            </div>
          </div>
          <!--右下角评论图标-->
          <div class="detail_hint">
            <!--点击评论图标-->
            <el-tooltip :enterable="false" effect="dark" content="点击评论" placement="top">
              <div class="detail_comment">
                <img class="comment" src="../../assets/iconfonts/comment.png" @click="toComment"/>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div class="comment_count"><b>共有{{commentCount}}条评论</b></div>
        <!--评论盒子-->
        <div class="post_comment_box" v-if="isComment===true">
        <div class="post_comment">
          <div class="hint_post"><a @click.prevent="cancelComment">取消评论</a></div>
          <div class="input_part">
            <!--评论提交表单-->
              <el-form ref="form" :model="commentForm" label-width="100px">
                <el-form-item label="称呼" class="name_input">
                  <el-input v-model="commentForm.name" placeholder="留下你的名字噢" type="text"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" class="mail_input">
                  <el-input v-model="commentForm.mail" placeholder="必填（会保密哒）" type="text"></el-input>
                </el-form-item>
                <el-form-item label="评论" class="comment_input">
                  <el-input v-model="commentForm.comment" placeholder="请输入你的评论" type="textarea" maxlength=500 :show-word-limit="true" rows=5></el-input>
                </el-form-item>
                <el-button class="post_btn" :plain="true" @click="submitComment">发表评论</el-button>
              </el-form>
          </div>
        </div>
      </div>
        <!--文章评论区域-->
        <div v-for="(item, index) in comment" :key="item._id">
          <!--一条父级评论-->
          <div class="comment-wrap">
          <!--左边头像和回复按钮-->
          <div class="photo_box">
            <img class="photo" src="../../assets/img/u=2719255841,2211073376&fm=26&gp=0.jpg"/>
            <a @click.prevent="replyComment(item._id)">回复</a>
          </div>
            <!--内容框-->
          <div class="comment-block">
            <div class="name">{{item.name}}               :</div>
            <div class="comment-text">{{item.content}}</div>
            <div class="bottom-comment">
              <div class="comment-date">{{item.Date}}</div>
              <div class="comment-actions">
                <div class="like"><img @click="likeFather(item._id, index)" src="../../assets/iconfonts/like.png"/></div>
                <span>{{item.likeCount}}</span>
                <div class="unlike"><img @click="unlikeFather(item._id, index)" src="../../assets/iconfonts/unlike.png"/></div>
                <span>{{item.unlikeCount}}</span>
              </div>
            </div>
            <!--一条子级评论-->
            <div v-show="item.child !== undefined && item.child.length > 0" >
              <div class="reply-wrap" v-for="(childitem, childindex) in item.child" :key="childitem._id">
                <!--左边头像和回复按钮-->
                <div class="photo_box">
                  <img class="photo" src="../../assets/img/u=2719255841,2211073376&fm=26&gp=0.jpg"/>
                  <a @click.prevent="replyChildMsg(index, childitem._id)">回复</a>
                </div>
                <!--内容框-->
                <div class="comment-block">
                  <div class="name">{{childitem.name}}       回复       {{childitem.father}}               :</div>
                  <div class="comment-text">{{childitem.content}}</div>
                  <!--底部信息框-->
                  <div class="bottom-comment">
                    <!--日期-->
                    <div class="comment-date">{{childitem.Date}}</div>
                    <!--点赞和踩操作-->
                    <div class="comment-actions">
                      <div class="like"><img @click="likeChild(childitem._id, index, childindex)" src="../../assets/iconfonts/like.png"/></div>
                      <span>{{childitem.likeCount}}</span>
                      <div class="unlike"><img @click="unlikeChild(childitem._id, index, childindex)" src="../../assets/iconfonts/unlike.png"/></div>
                      <span>{{childitem.unlikeCount}}</span>
                    </div>
                  </div>
                </div>
                <!--二级回复留言区域-->
                <div class="reply_child" v-show="childitem.isReply">
                  <div class="hint_reply"><a @click.prevent="cancelChildReply(index, childitem._id)">取消回复</a></div>
                  <div class="reply_part">
                    <!--留言回复表单-->
                    <el-form ref="form" :model="replyChildForm" label-width="100px">
                      <el-form-item label="称呼" class="name_reply">
                        <el-input v-model="replyChildForm.name" placeholder="留下你的名字噢" type="text"></el-input>
                      </el-form-item>
                      <el-form-item label="邮箱" class="mail_reply">
                        <el-input v-model="replyChildForm.mail" placeholder="必填（会保密哒）" type="text"></el-input>
                      </el-form-item>
                      <el-form-item label="回复" class="msg_reply">
                        <el-input v-model="replyChildForm.reply" placeholder="请输入你的回复" type="textarea" maxlength=200 :show-word-limit="true" rows=5></el-input>
                      </el-form-item>
                      <el-button class="reply_btn" @click="postChildMsg(item._id, childitem.name, index)" :plain="true">提交回复</el-button>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <!--一级回复留言区域-->
          <div class="reply_msg_box" v-show="item.isReply">
          <div class="reply_msg">
            <div class="hint_reply"><a @click.prevent="cancelReply(item._id)">取消回复</a></div>
            <div class="reply_part">
              <!--留言回复表单-->
              <el-form :model="replyForm" label-width="100px">
                <el-form-item label="称呼" class="name_reply">
                  <el-input v-model="replyForm.name" placeholder="留下你的名字噢" type="text"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" class="mail_reply">
                  <el-input v-model="replyForm.mail" placeholder="必填（会保密哒）" type="text"></el-input>
                </el-form-item>
                <el-form-item label="回复" class="msg_reply">
                  <el-input v-model="replyForm.reply" placeholder="请输入你的回复" type="textarea" maxlength=200 :show-word-limit="true" rows=5></el-input>
                </el-form-item>
                <el-button class="reply_btn" @click="postReplyMsg(item._id, item.name, index)" :plain="true">提交回复</el-button>
              </el-form>
            </div>
          </div>
        </div>
        </div>
        <!--回到顶部-->
        <el-backtop :bottom="90">
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
      <div id="footer"></div>
    </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  name: 'Detail',
  data () {
    return {
      navigation: [
        { id: 1, value: '主页', path: 'home' },
        { id: 2, value: '日志', path: 'blog' },
        { id: 3, value: '留言', path: 'Imessage' }
      ],
      commentForm: {
        name: '',
        mail: '',
        comment: ''
      },
      replyForm: {
        name: '',
        mail: '',
        reply: ''
      },
      replyChildForm: {
        name: '',
        mail: '',
        reply: ''
      },
      commentCount: 0,
      comment: [],
      isComment: false,
      articleId: '',
      title: '',
      content: '',
      tag: '',
      date: ''
    }
  },
  methods: {
    goBackToBlog: function () {
      this.$router.go(-1)
    },
    toComment: function () {
      this.isComment = true
    },
    cancelComment: function () {
      this.isComment = false
    },
    // 获取当前日期
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
    // 显示一级回复输入框
    replyComment: function (id) {
      this.comment.forEach((item) => {
        for (let i = 0; item.child !== undefined && i < item.child.length; ++i) {
          this.$set(item.child, i, { ...item.child[i], isReply: false })
        }
      })
      this.comment.find((value, index) => {
        if (value._id === id) {
          this.$set(this.comment, index, { ...value, isReply: true })
        } else if (value._id !== id) {
          this.$set(this.comment, index, { ...value, isReply: false })
        }
      })
    },
    // 取消一级回复
    cancelReply: function (id) {
      this.comment.find((value, index) => {
        if (value._id === id) {
          this.$set(this.comment, index, { ...value, isReply: false })
        }
      })
    },
    // 显示二级回复输入框
    replyChildMsg: function (ind, id) {
      this.comment.forEach((item) => {
        this.$set(item, 'isReply', false)
      })
      this.comment.forEach((item, indexi) => {
        if (ind !== indexi) {
          for (let i = 0; item.child !== undefined && i < item.child.length; ++i) {
            this.$set(item.child, i, { ...item.child[i], isReply: false })
          }
        }
      })
      this.comment[ind].child.find((value, index) => {
        if (value._id === id) {
          this.$set(this.comment[ind].child, index, { ...value, isReply: true })
        } else if (value._id !== id) {
          this.$set(this.comment[ind].child, index, { ...value, isReply: false })
        }
      })
    },
    // 取消二级回复
    cancelChildReply: function (ind, id) {
      this.comment[ind].child.find((value, index) => {
        if (value._id === id) {
          this.$set(this.comment[ind].child, index, { ...value, isReply: false })
        }
      })
    },
    // 发表评论
    submitComment: function () {
      const that = this
      if (that.commentForm.mail === '' || that.commentForm.comment === '') {
        Notification({
          title: '发表失败',
          message: '邮箱或者留言内容不能为空噢>_<',
          type: 'warning'
        })
      } else {
        const name = that.commentForm.name
        const mail = that.commentForm.mail
        const comment = that.commentForm.comment
        const date = that.getNowFormatDate()
        that.$http({
          method: 'post',
          url: 'postComment',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            aid: that.articleId,
            name: name,
            mail: mail,
            comment: comment,
            date: date
          }
        }).then(ret => {
          if (ret.status === 200) {
            Notification({
              title: '成功',
              message: '发表成功',
              type: 'success'
            })
            that.commentForm.name = ''
            that.commentForm.mail = ''
            that.commentForm.comment = ''
            ret.data.isReply = false
            ret.data.child = []
            that.comment.push(ret.data)
            that.commentCount += 1
          } else {
            Notification({
              title: '失败',
              message: '发表失败',
              type: 'error'
            })
          }
        })
      }
    },
    // 发表一级回复的评论
    postReplyMsg: function (fatherId, fatherName, index) {
      const that = this
      if (that.replyForm.mail === '' || that.replyForm.reply === '') {
        Notification({
          title: '回复失败',
          message: '邮箱或者回复内容不能为空噢>_<',
          type: 'warning'
        })
      } else {
        const name = that.replyForm.name
        const mail = that.replyForm.mail
        const reply = that.replyForm.reply
        const date = that.getNowFormatDate()
        that.$http({
          method: 'post',
          url: 'replyComment',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            aid: that.articleId,
            name: name,
            mail: mail,
            content: reply,
            date: date,
            fatherId: fatherId,
            fatherName: fatherName
          }
        }).then(function (ret) {
          if (ret.status === 200) {
            Notification({
              title: '成功',
              message: '回复成功',
              type: 'success'
            })
            ret.data.isReply = false
            that.comment[index].child.push(ret.data)
            that.replyForm.name = ''
            that.replyForm.mail = ''
            that.replyForm.reply = ''
          } else {
            Notification({
              title: '失败',
              message: '回复失败',
              type: 'error'
            })
          }
        })
      }
    },
    // 发表二级回复的评论
    postChildMsg: function (id, fatherName, index) {
      const that = this
      if (that.replyChildForm.mail === '' || that.replyChildForm.reply === '') {
        Notification({
          title: '回复失败',
          message: '邮箱或者回复内容不能为空噢>_<',
          type: 'warning'
        })
      } else {
        const name = that.replyChildForm.name
        const mail = that.replyChildForm.mail
        const reply = that.replyChildForm.reply
        const date = that.getNowFormatDate()
        that.$http({
          method: 'post',
          url: 'replyComment',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            aid: that.articleId,
            name: name,
            mail: mail,
            content: reply,
            date: date,
            fatherId: id,
            fatherName: fatherName
          }
        }).then(function (ret) {
          if (ret.status === 200) {
            Notification({
              title: '成功',
              message: '回复成功',
              type: 'success'
            })
            ret.data.isReply = false
            that.comment[index].child.push(ret.data)
            that.replyChildForm.name = ''
            that.replyChildForm.mail = ''
            that.replyChildForm.reply = ''
          } else {
            Notification({
              title: '失败',
              message: '回复失败',
              type: 'error'
            })
          }
        })
      }
    },
    // 赞父评论
    likeFather: function (id, index) {
      this.$http({
        method: 'post',
        url: 'likeComment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.comment[index].likeCount = ret.data.count
      })
    },
    // 踩父评论
    unlikeFather: function (id, index) {
      this.$http({
        method: 'post',
        url: 'unlikeComment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.comment[index].unlikeCount = ret.data.count
      })
    },
    // 赞子评论
    likeChild: function (id, father, self) {
      this.$http({
        method: 'post',
        url: 'likeComment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.comment[father].child[self].likeCount = ret.data.count
      })
    },
    // 踩子评论
    unlikeChild: function (id, father, self) {
      this.$http({
        method: 'post',
        url: 'unlikeComment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.comment[father].child[self].unlikeCount = ret.data.count
      })
    }
  },
  mounted: function () {
    const that = this
    const blogId = that.$route.params.id
    sessionStorage.setItem('aid', blogId)
    const articleId = sessionStorage.getItem('aid')
    that.$http({
      method: 'get',
      url: 'getBlogById',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        articleId: articleId
      }
    }).then(function (ret) {
      that.articleId = ret.data._id
      that.title = ret.data.title
      that.content = ret.data.content
      that.tag = ret.data.tag
      that.date = ret.data.date
      that.browse = ret.data.browse
    })
    that.$http({
      method: 'get',
      url: 'getCommentByBlog',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        articleId: articleId
      }
    }).then(function (ret) {
      ret.data.forEach(item => {
        item.isReply = false
        item.child = []
        if (item.differId === 1) {
          that.comment.push(item)
          that.commentCount += 1
        } else if (item.differId === 2) {
          for (let i = 0; i < that.comment.length; ++i) {
            if (item.fatherComment === that.comment[i]._id) {
              that.comment[i].child.push(item)
            }
          }
        }
      })
    })
  }
}
</script>

<style scoped>
  #detail{
    height: auto;
    width: 100%;
    overflow: auto;
  }
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
  #body{
    width: 100%;
    height: 100%;
    background-color: #DDDDDD;
    overflow: auto;
  }
  #body .show_detail{
    width: 900px;
    padding: 40px 0;
    display: flex;
    margin: auto;
  }
  #body .show_detail .detail_content{
    width: 900px;
  }
  #body .detail_hint{
    display: inline-block;
    position: relative;
    width: 70px;
    margin-left: 10px;
  }
  #body .detail_hint .detail_comment{
    position: absolute;
    bottom: 15px;
    cursor: pointer;
    text-align: center;
  }
  #body .detail_hint .detail_comment .comment{
    height: 50px;
    width: 50px;
  }
  #body .show_detail .detail_box{
    background-color: white;
    padding: 0 10px;
    border-radius: 8px;
    display: inline-block;
  }
  #body .show_detail .detail_box .detail_navigation{
    margin-top: 10px;
    margin-left: 0;
  }
  #body .show_detail .detail_box .detail_content{
    margin-top: 20px;
  }
  #body .show_detail .detail_box .detail_info{
    margin: 40px 0;
  }
  #body .show_detail .detail_box .detail_info span{
    color: #008800;
    margin-right: 30px;
  }
  #body .comment_count{
    text-align: center;
    margin: 10px;
  }
  #body .post_comment_box{
    padding: 20px;
  }
  #body .post_comment{
    width: 750px;
    background-color: white;
    margin: auto;
    border-radius: 8px;
    padding: 10px;
  }
  #body .post_comment .hint_post a{
    cursor: pointer;
  }
  #body .post_comment .input_part .name_input{
    width: 320px;
    margin-top: 20px;
    margin-left: 70px;
    display: inline-block;
  }
  #body .post_comment .input_part .mail_input{
    width: 320px;
    margin-top: 20px;
    margin-left: 20px;
    display: inline-block;
  }
  #body .post_comment .input_part .comment_input{
    margin-top: 5px;
    margin-left: 70px;
    width: 660px;
  }
  #body .post_comment .input_part .post_btn{
    width: 100px;
    margin-left: 630px;
    margin-bottom: 10px;
  }
  /*一级回复框样式*/
  #body .reply_msg_box{
    padding: 15px;
  }
  #body .reply_msg{
    width: 750px;
    background-color: white;
    margin: auto;
    border-radius: 8px;
    padding: 10px;
  }
  #body .reply_msg .hint_reply a{
    cursor: pointer;
  }
  #body .reply_msg .reply_part .name_reply{
    width: 320px;
    margin-top: 20px;
    margin-left: 70px;
    display: inline-block;
  }
  #body .reply_msg .reply_part .mail_reply{
    width: 320px;
    margin-top: 20px;
    margin-left: 20px;
    display: inline-block;
  }
  #body .reply_msg .reply_part .msg_reply{
    margin-top: 5px;
    margin-left: 70px;
    width: 660px;
  }
  #body .reply_msg .reply_part .reply_btn{
    width: 100px;
    margin-left: 630px;
    margin-bottom: 10px;
  }
  /*父评论样式*/
  .comment-wrap {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .photo_box {
    width: 70px;
    text-align: center;
  }
  .photo_box a{
    color: #006699;
    font-size: 15px;
    cursor: pointer;
  }
  .photo_box .photo {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
  .comment-block {
    border-radius: 8px;
    background-color: white;
    width: 680px;
    margin-left: 10px;
    padding: 5px;
  }
  .comment-block textarea {
    width: 100%;
    max-width: 100%;
  }
  .comment-wrap .comment-block .name{
    color: dimgray;
    font-size: 15px;
  }
  .comment-text {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .bottom-comment {
    color: #008800;
    font-size: 0.875rem;
  }
  .comment-date {
    float: left;
  }
  .comment-actions {
    float: right;
    display: flex;
    justify-content: center;
  }
  .comment-actions .like{
    margin-right: 7px;
  }
  .comment-actions .unlike{
    margin-left: 10px;
    margin-right: 7px;
  }
  .comment-actions .like img{
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
  .comment-actions .unlike img {
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
  /*子评论样式*/
  .reply-wrap {
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .reply-wrap .photo_box {
    width: 50px;
    text-align: center;
    display: inline-block;
  }
  .reply-wrap .photo_box a{
    color: #006699;
    font-size: 13px;
    cursor: pointer;
  }
  .reply-wrap .photo_box .photo {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
  .reply-wrap .comment-block {
    border-radius: 8px;
    border: #dddddd solid 1px;
    width: 600px;
    margin-left: 10px;
    margin-top: 0;
    padding: 5px;
    display: inline-block;
    vertical-align: top;
  }
  .reply-wrap .comment-block .name{
    color: dimgray;
    font-size: 15px;
  }
  .reply-wrap .comment-block textarea {
    width: 100%;
    max-width: 100%;
  }
  .reply-wrap .comment-text {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .reply-wrap .bottom-comment {
    color: #008800;
    font-size: 0.875rem;
  }
  .reply-wrap .comment-date {
    float: left;
  }
  .reply-wrap .comment-actions {
    float: right;
    display: flex;
    justify-content: center;
  }
  .reply-wrap .comment-actions .like{
    margin-right: 7px;
  }
  .reply-wrap .comment-actions .unlike{
    margin-left: 10px;
    margin-right: 7px;
  }
  .reply-wrap .comment-actions .like img{
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
  .reply-wrap .comment-actions .unlike img {
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
  /*子级回复输入框*/
  #body .reply_child{
    width: 650px;
    margin: 10px auto;
    border-radius: 8px;
    padding: 5px;
    border: #dddddd solid 1px;
  }
  #body .reply_child .hint_reply a{
    cursor: pointer;
  }
  #body .reply_child .reply_part .name_reply{
    width: 270px;
    margin-top: 20px;
    margin-left: 70px;
    display: inline-block;
  }
  #body .reply_child .reply_part .mail_reply{
    width: 270px;
    margin-top: 20px;
    margin-left: 20px;
    display: inline-block;
  }
  #body .reply_child .reply_part .msg_reply{
    margin-top: 5px;
    margin-left: 70px;
    width: 560px;
  }
  #body .reply_child .reply_part .reply_btn{
    width: 100px;
    margin-left: 530px;
    margin-bottom: 10px;
  }
  #footer{
    height: 80px;
    line-height: 120px;
    background-color: #ffffff;
  }
</style>
