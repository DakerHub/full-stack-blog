<template>
  <section class="post-comment">
    <h3 class="post-comment-title primary-text-color">评论</h3>
    <div class="post-comment-to-post">
      <textarea class="post-comment-textarea" v-model="comment" :maxlength="totalSize" rows="4"></textarea>
      <span class="post-comment-to-post__count">{{`${curCount}/${totalSize}`}}</span>
      <button
        :class="{
          'post-comment-btn': true,
          'is-disabled': !comment
        }"
        :disabled="!comment"
        @click="submit">{{btnName}}</button>
    </div>
    <div class="post-comment-list" v-if="commentList.length">
      <div
        class="post-comment-main" 
        v-for="(item, index) in commentList"
        :key="item._id">
        <div class="post-comment-avatar">
          <img :src="item.author.userPic" alt="">
        </div>
        <div class="post-comment-content">
          <div class="post-comment-username">{{item.author.username}}</div>
          <p>{{item.content}}</p>
          <div class="post-comment-mate">
            <button data-type="text" @click="toggleExpand(item)">
              <i class="iconfont icon-comment"></i>
              {{item.replyCount?`${item.replyCount}条`:''}}回复
            </button>
            <button
              v-if="item.authorId===user.id"
              data-type="text"
              @click="deleteComment(item, true)">
              <i class="iconfont icon-shanchu"></i>
              删除
            </button>
            <time class="post-comment-mate-date">&nbsp;{{item.createdDate}}</time>
          </div>
          <div class="post-comment-reply" v-if="expands.includes(item._id)">
            <span class="post-comment-reply-tri"></span>
            <div class="post-comment-reply-list">
              <div
                class="post-comment-main"
                v-for="subComment in item.subComments"
                :key="subComment._id">
                <div class="post-comment-avatar">
                  <img :src="subComment.author.userPic" alt="">
                </div>
                <div class="post-comment-content">
                  <div class="post-comment-username">
                    {{subComment.author.username}}
                    <span
                      class="post-comment-replyto"
                      v-if="subComment.replyTo && item.authorId !== subComment.replyTo._id">
                      @ {{subComment.replyTo.username}}</span>
                  </div>
                  <p>{{subComment.content}}</p>
                  <div class="post-comment-mate">
                    <button data-type="text" @click="setReplyTo(item, subComment)"><i class="iconfont icon-comment"></i>回复</button>
                    <button
                      v-if="subComment.authorId===user.id"
                      data-type="text"
                      @click="deleteComment(subComment, false)">
                      <i class="iconfont icon-shanchu"></i>删除
                    </button>
                    <time class="post-comment-mate-date">&nbsp;{{subComment.createdDate}}</time>
                  </div>
                </div>
              </div>
            </div>
            <div class="post-comment-pagination">
              <BasePagination
                :total="item.replyCount"
                :current-page="item.currentPage"
                :page-size="5"
                :hide-only-one="true"
                @current-change="val => subCommentPageChange(val, item)"></BasePagination>
            </div>
            <div class="post-comment-reply-form">
              <input
                type="text"
                v-model="item.replyInput"
                :maxlength="totalSize"
                :placeholder="(item.replyInputTo.id?`@${item.replyInputTo.name}:`:'') + `内容长度限制在${totalSize}以内`">

              <!-- 
                当点击某个自评论的回复时,意思为回复该子评论,输入框出现@某用户的字样,而且当输入框为空时,按钮字样为"取消,
                点击按钮后,取消@用户,而改为直接回复顶级评论
              -->
              <button
                :class="{
                  'post-comment-reply-form-btn': true,
                  'is-disabled': !item.replyInput&&!item.replyInputTo.id
                }"
                :disabled="!item.replyInput&&!item.replyInputTo.id"
                @click="beforeSubmitSubComment(item)">
                {{item.replyInputTo.id && !item.replyInput ? '取消' : btnName}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="post-comment-placeholder" v-else><i class="iconfont icon-comment"></i>暂无评论，快来抢沙发！</div>
    <div class="post-comment-pagination">
      <BasePagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :hide-only-one="true"
        @current-change="commentPageChange"></BasePagination>
    </div>
  </section>
</template>

<script>
import { newCommment, getPostComments, getSubComments, deleteComment } from './../assets/api/index.js';
import { date2text } from './../assets/util/util.js';
import BasePagination from './../components/BasePagination.vue';

export default {
  name: 'PostDetailComment',
  props: {
    postId: {
      type: String
    }
  },
  data() {
    return {
      // 评论限制字数
      totalSize: 10,

      comment: '',
      commentList: [],
      expands: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  components: {
    BasePagination
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
    },
    curCount() {
      return this.comment.length;
    }
  },
  watch: {
    postId: {
      immediate: true,
      handler(id) {
        id && this.getPostComments(id);
      }
    }
  },
  methods: {
    submit() {
      this.hasLogin ? this.submitComment() : this.showLogin();
    },
    beforeSubmitSubComment(comment) {
      if (comment.replyInputTo.id && !comment.replyInput) {
        comment.replyInputTo = { id: '', name: '' };
        return;
      }
      if (!this.hasLogin) {
        return this.showLogin();
      }
      if (!(comment.replyInputTo.id && !comment.replyInput)) {
        this.submitComment({
          pId: comment._id,
          replyTo: comment.replyInputTo.id,
          content: comment.replyInput
        });
      }
    },
    submitComment(subComment) {
      const params = {
        postId: this.postId,
        content: this.comment,
        authorId: this.user.id
      }
      if (subComment) {
        const { pId, replyTo, content } = subComment;
        pId && (params.pId = pId);
        replyTo && (params.replyTo = replyTo);
        content && (params.content = content);
      }
      newCommment(params).then(data => {
        if (subComment) {
          const pId = subComment.pId;
          this.findAndSet(pId, 'replyInput', '');
          this.findAndSet(pId, 'replyInputTo', {id: '', name: ''});
          this.changeReplyCount(pId, 'increase');
          this.getSubComments(pId);
        } else {
          this.comment = '';
          this.getPostComments(this.postId);
        }
        this.$store.dispatch('getNewestComments');
      }).catch(err => {
        console.log(err);
      });
    },
    showLogin() {
      this.$store.commit('showLogin', 'login');
    },
    getPostComments(id) {
      const params = {
        postId: id,
        pId: '0',
        page: this.currentPage,
        size: this.pageSize
      }
      getPostComments(params).then(data => {
        data.sources.forEach(comment => {
          comment.createdDate = date2text(comment.createdDate);
          comment.subComments = [];
          comment.replyInput = '';
          comment.replyInputTo = {
            id: '',
            name: ''
          };
          comment.currentPage = 1;
        });
        this.commentList = data.sources;
        this.total = data.total;
        this.expands = [];
      }).catch(err => {
        console.error(err);
      });
    },
    getSubComments(pId) {
      const params = {
        pId,
        postId: this.postId,
        page: this.findAndSet(pId, 'currentPage'),
        size: 5
      };
      getSubComments(params).then(data => {
        data.sources.forEach(comment => {
          comment.createdDate = date2text(comment.createdDate);
        });
        const subComments = data.sources;
        this.findAndSet(pId, 'subComments', subComments);
      }).catch(err => {
        console.error(err);
      });
    },
    deleteComment(comment, isToPost) {
      const sure = confirm('删除评论可能会影响到其他评论，是否继续？');
      if (!sure) {
        return;
      }
      deleteComment(comment._id).then(res => {
        isToPost ? this.getPostComments(comment.postId) : this.getSubComments(comment.pId);
        this.changeReplyCount(comment.pId, 'decrease');
        this.$store.dispatch('getNewestComments');
      }).catch(err => {
      });
    },
    toggleExpand(item) {
      const id = item._id;
      const idx = this.expands.indexOf(id);
      if (idx === -1) {
        this.expands.push(id);
        this.getSubComments(id);
      } else {
        this.expands.splice(idx, 1);
        this.findAndSet(id, 'subComments', []);
      }
    },
    findAndSet(id, field, val) {
      let result;
      this.commentList.some(comment => {
        if (comment._id === id) {
          if (typeof val !== 'undefined') {
            comment[field] = val;
          }
          result = comment[field];
          return true;
        }
      });
      return result;
    },
    changeReplyCount(id, action) {
      this.commentList.some(comment => {
        if (comment._id === id) {
          switch(action) {
            case　'increase':
              comment.replyCount++;
              break;
            case　'decrease':
              comment.replyCount--;
              break;
          }
          return true;
        }
      });
    },
    setReplyTo(comment, subComment) {
      comment.replyInputTo = {
        id: subComment.authorId,
        name: subComment.author.username
      };
      comment.replyInput = '';
    },
    commentPageChange(page) {
      this.currentPage = page;
      this.getPostComments(this.postId);
    },
    subCommentPageChange(page, comment) {
      comment.currentPage = page;
      this.getSubComments(comment._id);
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
.post-comment-to-post__count{
  font-size: .8em;
}
.post-comment-btn{
  float: right;
  margin-top: 5px;
}
.post-comment-list{
  margin-top: 1em;
}
.post-comment-placeholder{
  width: 100%;
  font-size: .8em;
  margin-top: 1em;
  text-align: center;
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
.post-comment-reply .post-comment-avatar{
  width: 32px;
  height: 32px;
}
.post-comment-content{
  font-size: .8rem;
  line-height: 1.2rem;
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
  padding: .5rem 0;
}
.post-comment-mate{
  display: flex;
  margin-top: 1em;
  color: #757575;
}
.post-comment-mate .iconfont{
  padding: 0;
}
.post-comment-mate button{
  color: #757575;
  flex-shrink: 0;
}
.post-comment-mate button:hover{
  color: #00BCD4;
}
.post-comment-mate-date{
  display: flex;
  align-items: center;
}
.post-comment-reply{
  position: relative;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 1em;
  margin-top: 15px;
}
.post-comment-reply-tri{
  position: absolute;
  top: -10px;
}
.post-comment-reply-tri::before{
  position: absolute;
  content: "";
  border-width: 0 9px 10px 9px;
  border-style: solid;
  border-color: #eaeaea transparent;
}
.post-comment-reply-tri::after{
  position: absolute;
  top: 2px;
  left: 2px;
  content: "";
  border-width: 0 7px 8px 7px;
  border-style: solid;
  border-color: #fff transparent;
}
.post-comment-reply-form{
  display: flex;
}
.post-comment-reply-form-btn{
  flex-shrink: 0;
  margin-left: 1em;
}
.post-comment-replyto{
  color: #757575;
}
.base-pagination{
  margin: 1em 0;
}
@media screen and (max-width: 768px) {
  .post-comment{
    margin: 2em 0;
  }
  .post-comment-btn{
    width: 100%;
    color: #fff;
    background-color: #00BCD4;
    border-color: #00BCD4;
  }
  .post-comment-reply-form{
    flex-wrap: wrap;
  }
  .post-comment-reply-form-btn{
    width: 100%;
    margin: 1em 0 0 0;
    border-color: #00BCD4;
    background-color: #00BCD4;
    color: #fff;
  }
}
</style>
