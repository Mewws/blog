<template>
    <div id="modify">
      <el-card class="el-card">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Imanage/Imanage_index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>管理文章</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Imanage/Imanage_index/edit' }">编辑</el-breadcrumb-item>
          <el-breadcrumb-item>修改</el-breadcrumb-item>
        </el-breadcrumb>
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
        <el-button class="post_btn" @click="save">保存</el-button>
        <mavon-editor class="editor"
                      ref=md
                      v-model  = 'content'
                      :box-shadow = 'true'
                      :ishljs = 'true'
        />
        <div class="comment_hint"><b>当前文章评论共{{commentCount}}条</b></div>
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
                <!--删除按钮-->
                <i class="el-icon-delete" @click="deleteComment(item._id, index)"></i>
                <div class="comment-actions">
                  <div class="like"><img src="../../assets/iconfonts/like.png"/></div>
                  <span>{{item.likeCount}}</span>
                  <div class="unlike"><img src="../../assets/iconfonts/unlike.png"/></div>
                  <span>{{item.unlikeCount}}</span>
                </div>
              </div>
              <!--一条子级评论-->
              <div v-show="item.child !== undefined && item.child.length > 0" >
                <div class="reply-wrap" v-for="childitem in item.child" :key="childitem._id">
                  <!--左边头像和回复按钮-->
                  <div class="photo_box">
                    <img class="photo" src="../../assets/img/u=2719255841,2211073376&fm=26&gp=0.jpg"/>
                    <a @click.prevent="replyChildMsg(index, childitem._id)">回复</a>
                  </div>
                  <!--内容框-->
                  <div class="comment-block">
                    <div class="name">{{childitem.name}}       回复       {{childitem.father}}          :</div>
                    <div class="comment-text">{{childitem.content}}</div>
                    <!--底部信息框-->
                    <div class="bottom-comment">
                      <!--日期-->
                      <div class="comment-date">{{childitem.Date}}</div>
                      <!--点赞和踩操作-->
                      <div class="comment-actions">
                        <div class="like"><img src="../../assets/iconfonts/like.png"/></div>
                        <span>{{childitem.likeCount}}</span>
                        <div class="unlike"><img src="../../assets/iconfonts/unlike.png"/></div>
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
          <div class="reply_msg" v-show="item.isReply">
            <div class="hint_reply"><a @click.prevent="cancelReply(item._id)">取消回复</a></div>
            <div class="reply_part">
              <!--留言回复表单-->
              <el-form :model="replyForm" label-width="100px">
                <el-form-item label="回复" class="msg_reply">
                  <el-input v-model="replyForm.reply" placeholder="请输入你的回复" type="textarea" maxlength=200 :show-word-limit="true" rows=5></el-input>
                </el-form-item>
                <el-button class="reply_btn" @click="postReplyMsg(item._id, item.name, index)" :plain="true">提交回复</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  name: 'Modify',
  data () {
    return {
      articleId: '',
      content: '',
      title: '',
      date: '',
      comment: [],
      commentCount: 0,
      replyForm: {
        name: '博主',
        mail: 'abc',
        reply: ''
      },
      replyChildForm: {
        name: '博主',
        mail: 'abc',
        reply: ''
      },
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
      value: ''
    }
  },
  methods: {
    // 删除父评论
    deleteComment: function (cid) {
      this.$http({
        method: 'post',
        url: 'deleteComment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: cid
        }
      }).then(ret => {
        if (ret.data === '删除成功') {
          Notification({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.comment = this.comment.filter(value => {
            return value._id !== cid
          })
          this.commentCount -= 1
        }
      })
    },
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
    // 保存修改的博客
    save: function () {
      this.date = this.getNowFormatDate()
      const that = this
      that.$http({
        method: 'post',
        url: 'modifyBlog',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: that.articleId,
          title: that.title,
          tag: that.value,
          content: that.content,
          date: that.date
        }
      }).then(function (ret) {
        if (ret.data.hint === '修改成功') {
          Notification({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        } else if (ret.data.hint === '修改失败') {
          Notification({
            title: '失败',
            message: '修改失败T_T请重试',
            type: 'error'
          })
        }
      })
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
    // 取消显示一级回复框
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
    // 取消显示二级回复框
    cancelChildReply: function (ind, id) {
      this.comment[ind].child.find((value, index) => {
        if (value._id === id) {
          this.$set(this.comment[ind].child, index, { ...value, isReply: false })
        }
      })
    },
    // 发表二级回复的评论
    postChildMsg: function (id, fatherName, index) {
      const that = this
      if (that.replyChildForm.reply === '') {
        Notification({
          title: '回复失败',
          message: '回复内容不能为空噢>_<',
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
    // 发表一级回复的评论
    postReplyMsg: function (fatherId, fatherName, index) {
      const that = this
      if (that.replyForm.reply === '') {
        Notification({
          title: '回复失败',
          message: '回复内容不能为空噢>_<',
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
    }
  },
  mounted: function () {
    const that = this
    that.articleId = that.$route.params.id
    that.$http({
      method: 'get',
      url: 'getBlogById',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        articleId: that.articleId
      }
    }).then(function (ret) {
      if (ret.data.hint === '请求成功') {
        that.articleId = ret.data._id
        that.title = ret.data.title
        that.content = ret.data.content
        that.value = ret.data.tag
      } else if (ret.data.hint === '请求失败') {
        Notification({
          title: '失败',
          message: '出错啦T_T请重试',
          type: 'error'
        })
      }
    })
    // 请求对应的评论
    that.$http({
      method: 'get',
      url: 'getCommentByBlog',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        articleId: that.articleId
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
.el-card{
  height: auto;
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
.el-icon-delete{
  margin-left: 10px;
  cursor: pointer;
}
.comment_hint{
  margin-top: 10px;
  text-align: center;
}
/*父评论样式*/
.comment-wrap {
  margin-top: 20px;
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
  margin-top: 20px;
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
.reply-wrap .comment-block .name {
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
/*一级回复框样式*/
 .reply_msg{
  width: 750px;
  background-color: white;
  margin: auto;
  border-radius: 8px;
  padding: 10px;
}
 .reply_msg .hint_reply a{
  cursor: pointer;
}
 .reply_msg .reply_part .name_reply{
  width: 320px;
  margin-top: 20px;
  margin-left: 70px;
  display: inline-block;
}
 .reply_msg .reply_part .mail_reply{
  width: 320px;
  margin-top: 20px;
  margin-left: 20px;
  display: inline-block;
}
 .reply_msg .reply_part .msg_reply{
  margin-top: 5px;
  margin-left: 70px;
  width: 660px;
}
 .reply_msg .reply_part .reply_btn{
  width: 100px;
  margin-left: 630px;
  margin-bottom: 10px;
}
/*子级回复输入框*/
 .reply_child{
  width: 650px;
  margin: 10px auto;
  border-radius: 8px;
  padding: 5px;
  border: #dddddd solid 1px;
}
 .reply_child .hint_reply a{
  cursor: pointer;
}
 .reply_child .reply_part .name_reply{
  width: 270px;
  margin-top: 20px;
  margin-left: 70px;
  display: inline-block;
}
 .reply_child .reply_part .mail_reply{
  width: 270px;
  margin-top: 20px;
  margin-left: 20px;
  display: inline-block;
}
 .reply_child .reply_part .msg_reply{
  margin-top: 5px;
  margin-left: 70px;
  width: 560px;
}
 .reply_child .reply_part .reply_btn{
  width: 100px;
  margin-left: 530px;
  margin-bottom: 10px;
}
</style>
