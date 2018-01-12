<template>
  <transition name="el-fade-in">
    <div class="user-new popup-box-outer">
      <div class="popup-box">
        <h2 class="popup-header">回复评论</h2>
        <i class="el-icon-close" title="关闭" @click="close"></i>
        <div class="popup-content">
          <el-form :model="form" label-width="100px">
            <el-form-item label="评论主题">
              {{targetComment.post.title}}
            </el-form-item>
            <el-form-item label="评论内容">
              {{targetComment.content}}
            </el-form-item>
            <el-form-item label="回复给">
              {{targetComment.author.username}}
            </el-form-item>
            <el-form-item label="回复内容">
              <el-input
                v-model="form.content"
                type="textarea"
                placeholder="请输入评论内容" />
            </el-form-item>
          </el-form>
        </div>
        <div class="popup-btns">
          <el-button type="primary" :loading="submiting" @click="submit">提交</el-button>
          <el-button type="primary" :loading="submiting" @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'CommentReply',
  props: {
    show: Boolean,
    targetComment: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        content: ''
      },
      submiting: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    async submit() {
      const { pId, post: { _id: postId }, author: { _id: replyTo } } = this.targetComment;
      const params = {
        postId,
        authorId: this.$store.state.user._id,
        replyTo,
        pId,
        content: this.form.content
      };
      this.submiting = true;
      try {
        await this.api.newComment(params);
        this.$emit('update-list');
        this.close();
      } catch (error) {
        console.error(error);
      } finally {
        this.submiting = false;
      }
    }
  }
};
</script>
<style scoped>
@keyframes my-zoom
{
  from {
    transform: scaleY(.1);
    opacity: .4;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
.popup-box{
  width: 500px;
  height: 420px;
  top: calc(50% - 210px);
  left: calc(50% - 250px);
  animation: my-zoom .3s;
}
.popup-content{
  padding-right: 40px;
  height: 300px;
}
.el-icon-close{
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 24px;
  transition: transform .5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.el-icon-close:hover{
  color: #333;
  transform: rotate(180deg);
}
.popup-btns{
  text-align: center;
}
</style>
