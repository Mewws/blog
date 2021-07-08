<template>
  <div id="message">
    <!--留言板主体-->
    <div id="body">
      <!--发表留言区域-->
      <div class="post_msg">
        <div class="hint_post"><b>发表你的留言</b></div>
        <!--输入区域-->
        <div class="input_part">
          <!--留言提交表单-->
          <el-form ref="messageFormRef" :model="messageForm" label-width="100px">
            <el-form-item label="称呼" class="name_input" prop="name">
              <el-input v-model="messageForm.name" placeholder="留下你的名字噢" type="text"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" class="mail_input" prop="mail">
              <el-input v-model="messageForm.mail" placeholder="必填（会保密哒）" type="text"></el-input>
            </el-form-item>
            <el-form-item label="评论" class="msg_input" prop="messageContent">
              <el-input v-model="messageForm.messageContent" placeholder="请输入你的留言" type="textarea" maxlength=200 :show-word-limit="true" rows=5></el-input>
            </el-form-item>
            <el-button class="post_btn" @click="postMsg" :plain="true">提交留言</el-button>
          </el-form>
        </div>
      </div>
      <div class="msgNum"><b>已有{{msgCount}}条留言</b></div>
      <div v-for="(item, index) in message" :key="item._id">
        <!--一条父级留言-->
        <div class="comment-wrap">
          <!--左边头像和回复按钮-->
          <div class="photo_box">
            <img class="photo" src="../assets/img/u=2719255841,2211073376&fm=26&gp=0.jpg"/>
            <a @click.prevent="replyMsg(item._id)">回复</a>
          </div>
          <!--内容框-->
          <div class="comment-block">
            <div class="name">{{item.name}}               :</div>
            <div class="comment-text">{{item.content}}</div>
            <!--底部信息框-->
            <div class="bottom-comment">
              <!--日期-->
              <div class="comment-date">{{item.Date}}</div>
              <!--点赞和踩操作-->
              <div class="comment-actions">
                <div class="like"><img @click="toLike(item._id, index)" src="../assets/iconfonts/like.png"/></div>
                <span>{{item.likeCount}}</span>
                <div class="unlike"><img @click="toUnLike(item._id, index)" src="../assets/iconfonts/unlike.png"/></div>
                <span>{{item.unlikeCount}}</span>
              </div>
            </div>
            <!--一条子级回复留言框-->
            <div v-show="item.child !== undefined && item.child.length > 0" >
              <div class="reply-wrap" v-for="(childitem, childindex) in item.child" :key="childitem._id">
                <!--左边头像和回复按钮-->
                <div class="photo_box">
                  <img class="photo" src="../assets/img/u=2719255841,2211073376&fm=26&gp=0.jpg"/>
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
                      <div class="like"><img @click="likeChild(childitem._id, index, childindex)" src="../assets/iconfonts/like.png"/></div>
                      <span>{{childitem.likeCount}}</span>
                      <div class="unlike"><img @click="unlikeChild(childitem._id, index, childindex)" src="../assets/iconfonts/unlike.png"/></div>
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
                        <el-input v-model="replyChildForm.reply" placeholder="请输入你的回复" type="textarea" maxlength=500 :show-word-limit="true" rows=5></el-input>
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
      <!--回到顶部-->
      <el-backtop :bottom="115">
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
import { Notification } from 'element-ui'
export default {
  name: 'Message',
  data () {
    return {
      navigation: [
        { id: 1, value: '主页', path: 'home' },
        { id: 2, value: '日志', path: 'blog' },
        { id: 3, value: '留言', path: 'message' }
      ],
      messageForm: {
        name: '',
        mail: '',
        messageContent: ''
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
      msgCount: 0,
      message: []
    }
  },
  components: {
  },
  methods: {
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
    // 提交发表的留言
    postMsg: function () {
      const that = this
      if (that.messageForm.mail === '' || that.messageForm.messageContent === '') {
        Notification({
          title: '提交失败',
          message: '邮箱或者留言内容不能为空噢>_<',
          type: 'warning'
        })
      } else {
        const uname = that.messageForm.name
        const umail = that.messageForm.mail
        const mcontent = that.messageForm.messageContent
        const mdate = that.getNowFormatDate()
        that.$http({
          method: 'post',
          url: 'postMessage',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            name: uname,
            mail: umail,
            content: mcontent,
            date: mdate
          }
        }).then(function (ret) {
          if (ret.status === 200) {
            Notification({
              title: '成功',
              message: '提交成功',
              type: 'success'
            })
            that.messageForm.name = ''
            that.messageForm.mail = ''
            that.messageForm.messageContent = ''
            ret.data.isReply = false
            ret.data.child = []
            that.message.push(ret.data)
            that.msgCount += 1
          } else {
            Notification({
              title: '失败',
              message: '提交失败',
              type: 'error'
            })
          }
        })
      }
    },
    // 一级回复留言输入框
    replyMsg: function (id) {
      this.message.forEach((item) => {
        for (let i = 0; item.child !== undefined && i < item.child.length; ++i) {
          this.$set(item.child, i, { ...item.child[i], isReply: false })
        }
      })
      this.message.find((value, index) => {
        if (value._id === id) {
          this.$set(this.message, index, { ...value, isReply: true })
        } else if (value._id !== id) {
          this.$set(this.message, index, { ...value, isReply: false })
        }
      })
    },
    // 一级取消留言输入框
    cancelReply: function (id) {
      this.message.find((value, index) => {
        if (value._id === id) {
          this.$set(this.message, index, { ...value, isReply: false })
        }
      })
    },
    // 二级回复留言输入框
    replyChildMsg: function (ind, id) {
      this.message.forEach((item) => {
        this.$set(item, 'isReply', false)
      })
      this.message.forEach((item, indexi) => {
        if (ind !== indexi) {
          for (let i = 0; item.child !== undefined && i < item.child.length; ++i) {
            this.$set(item.child, i, { ...item.child[i], isReply: false })
          }
        }
      })
      this.message[ind].child.find((value, index) => {
        if (value._id === id) {
          this.$set(this.message[ind].child, index, { ...value, isReply: true })
        } else if (value._id !== id) {
          this.$set(this.message[ind].child, index, { ...value, isReply: false })
        }
      })
    },
    // 二级取消留言输入框
    cancelChildReply: function (ind, id) {
      this.message[ind].child.find((value, index) => {
        if (value._id === id) {
          this.$set(this.message[ind].child, index, { ...value, isReply: false })
        }
      })
    },
    // 提交一级回复的留言
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
          url: 'replyMessage',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
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
            that.message[index].child.push(ret.data)
            that.messageForm.name = ''
            that.messageForm.mail = ''
            that.messageForm.message = ''
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
    // 提交二级回复的留言
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
          url: 'replyMessage',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
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
            that.message[index].child.push(ret.data)
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
    // 父留言点赞
    toLike: function (id, index) {
      this.$http({
        method: 'post',
        url: 'likeMsg',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.message[index].likeCount = ret.data.count
      })
    },
    // 踩父留言
    toUnLike: function (id, index) {
      this.$http({
        method: 'post',
        url: 'unlikeMsg',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.message[index].unlikeCount = ret.data.count
      })
    },
    // 赞子留言
    likeChild: function (id, father, self) {
      this.$http({
        method: 'post',
        url: 'likeMsg',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.message[father].child[self].likeCount = ret.data.count
      })
    },
    // 踩子留言
    unlikeChild: function (id, father, self) {
      this.$http({
        method: 'post',
        url: 'unlikeMsg',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      }).then(ret => {
        this.message[father].child[self].unlikeCount = ret.data.count
      })
    }
  },
  mounted: function () {
    const that = this
    that.$http({
      method: 'get',
      url: 'getAllMessages',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(ret => {
      ret.data.forEach(item => {
        item.isReply = false
        item.child = []
        if (item.differId === 1) {
          that.message.push(item)
          that.msgCount += 1
        } else if (item.differId === 2) {
          for (let i = 0; i < that.message.length; ++i) {
            if (item.fatherMessage === that.message[i]._id) {
              that.message[i].child.push(item)
            }
          }
        }
      })
    })
  }
}
</script>

<style scoped>
  #body{
    width: 100%;
    height: 100%;
    background-color: #dddddd;
    padding: 20px 0;
  }
  #body .post_msg{
    width: 850px;
    background-color: white;
    margin: auto;
    border-radius: 8px;
    padding: 10px;
  }
  #body .post_msg .hint_post a{
    cursor: pointer;
  }
  #body .post_msg .input_part .name_input{
    width: 320px;
    margin-top: 20px;
    margin-left: 70px;
    display: inline-block;
  }
  #body .post_msg .input_part .mail_input{
    width: 320px;
    margin-top: 20px;
    margin-left: 20px;
    display: inline-block;
  }
  #body .post_msg .input_part .msg_input{
    margin-top: 5px;
    margin-left: 70px;
    width: 660px;
  }
  #body .post_msg .input_part .post_btn{
    width: 100px;
    margin-left: 630px;
    margin-bottom: 10px;
  }
  #body .reply_msg{
    width: 850px;
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
  .msgNum{
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }
  .comment-wrap {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
  .comment-wrap .photo_box {
    width: 70px;
    text-align: center;
  }
  .comment-wrap .photo_box a{
    color: #006699;
    font-size: 15px;
    cursor: pointer;
  }
  .comment-wrap .photo_box .photo {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
  .comment-wrap .comment-block {
    border-radius: 8px;
    background-color: white;
    width: 770px;
    margin-left: 10px;
    padding: 5px;
  }
  .comment-wrap .comment-block .name{
    color: dimgray;
    font-size: 15px;
  }
  .comment-wrap .comment-block textarea {
    width: 100%;
    max-width: 100%;
  }
  .comment-wrap .comment-text {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .comment-wrap .bottom-comment {
    color: #008800;
    font-size: 0.875rem;
  }
  .comment-wrap .comment-date {
    float: left;
  }
  .comment-wrap .comment-actions {
    float: right;
    display: flex;
    justify-content: center;
  }
  .comment-wrap .comment-actions .like{
    margin-right: 7px;
  }
  .comment-wrap .comment-actions .unlike{
    margin-left: 10px;
    margin-right: 7px;
  }
  .comment-wrap .comment-actions .like img{
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
  .comment-wrap .comment-actions .unlike img {
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
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
    width: 690px;
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
  #body .reply_child{
    width: 750px;
    margin: 10px auto;
    border-radius: 8px;
    padding: 5px;
    border: #dddddd solid 1px;
  }
  #body .reply_child .hint_reply a{
    cursor: pointer;
  }
  #body .reply_child .reply_part .name_reply{
    width: 300px;
    margin-top: 20px;
    margin-left: 70px;
    display: inline-block;
  }
  #body .reply_child .reply_part .mail_reply{
    width: 300px;
    margin-top: 20px;
    margin-left: 20px;
    display: inline-block;
  }
  #body .reply_child .reply_part .msg_reply{
    margin-top: 5px;
    margin-left: 70px;
    width: 620px;
  }
  #body .reply_child .reply_part .reply_btn{
    width: 100px;
    margin-left: 590px;
    margin-bottom: 10px;
  }
  .hint_post a{
    cursor: pointer;
  }
</style>
