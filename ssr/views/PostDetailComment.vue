<template>
  <section class="post-comment">
    <h3 class="post-comment-title primary-text-color">评论</h3>
    <div class="post-comment-to-post">
      <textarea class="post-comment-textarea" v-model="comment" rows="4"></textarea>
      <button
        :class="{
          'post-comment-btn': true,
          'is-disabled': !comment
        }"
        :disabled="!comment"
        @click="submit">{{btnName}}</button>
    </div>
    <div class="post-comment-list">
      <ul>
        <li
          class="post-comment-main" 
          v-for="item in commentList"
          :key="item._id">
          <div class="post-comment-avatar">
            <img :src="item.author.userPic" alt="">
          </div>
          <div class="post-comment-content">
            <div class="post-comment-username">{{item.author.username}}</div>
            <p>{{item.content}}</p>
            <div>
              <span>回复</span>
              <span>{{item.createdDate}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { newCommment, getPostComments } from './../assets/api/index.js';
export default {
  name: 'PostDetailComment',
  props: {
    postId: {
      type: String
    }
  },
  data() {
    return {
      comment: '',
      commentList: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    hasLogin() {
      return this.user.id;
    },
    btnName() {
      return this.hasLogin ? '提交' : '登录后评论';
    }
  },
  mounted() {
    this.getPostComments();
  },
  methods: {
    submit() {
      this.hasLogin ? this.submitComment() : this.showLogin();
    },
    submitComment() {
      const params = {
        postId: this.postId,
        content: this.comment,
        authorId: this.user.id
      }
      newCommment(params).then(res => {
        console.log('评论成功!');
        this.comment = '';
        this.getPostComments();
      }).catch(err => {
        console.log('err');
      });
    },
    showLogin() {
      this.$store.commit('showLogin', 'login');
      console.log('login');
    },
    getPostComments() {
      getPostComments(this.postId).then(({ data }) => {
        this.commentList = data.sources; 
      }).catch(err => {
        console.error(err);
      });
    }
  }
}
</script>

<style scoped>
.post-comment{
  margin: 2em;
}
.post-comment-title{
  width: 100%;
  text-align: center;
}
.post-comment-to-post{
  margin-top: 1em;
  overflow: hidden;
}
.post-comment-btn{
  float: right;
  margin-top: 5px;
}
.post-comment-list{
  margin-top: 1em;
}
.post-comment-main{
  display: flex;
  align-items: flex-start;
  margin-bottom: 1em;
}
.post-comment-main:not(:last-of-type)>.post-comment-content{
  border-bottom: thin solid #f5f5f5;
}
.post-comment-avatar{
  width: 40px;
  height: 40px;
  border: 2px solid #673AB7;
  border-radius: 50%;
  overflow: hidden;
  background-image: url('/static/avatar/default_avatar.png');
  background-size: contain;
  flex-shrink: 0;
}
.post-comment-content{
  font-size: .8em;
  line-height: 1.5em;
  margin-left: 1em;
  padding-bottom: 1em;
  flex-grow: 1;
}
.post-comment-avatar img{
  width: 100%;
  height: 100%;
}
.post-comment-username{
  font-weight: bold;
  padding: 1em 0;
}
@media screen and (max-width: 768px) {
  .post-comment-btn{
    width: 100%;
    color: #fff;
    background-color: #00BCD4;
    border-color: #00BCD4;
  }
}
</style>
