<template>
  <div class="base-pagination" v-show="!(hideOnlyOne && pageNum === 1)">
    <ul class="base-pagination-inner">
      <li
        :class="{
          'base-pagination-single': true,
          'is-disabled': currentPageCopy === 1
        }"
        v-show="false"
        @click="changeCurrent('prev')">&lt;</li>
      <li
        :class="{
          'base-pagination-single': true,
          'active-bg-color text-primary-color': n === currentPageCopy
        }"
        v-for="(n, index) in pageTotal"
        :key="index+n"
        @click="changeCurrent(n, index)">{{n}}</li>
      <li
        :class="{
          'base-pagination-single': true,
          'is-disabled': currentPageCopy === pageTotal
        }"
        v-show="false"
        @click="changeCurrent('next')">&gt;</li>
    </ul>
    <span
      class="base-pagination-total"
      v-show="false">共{{total}}条</span>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    total: {
      require: true,
      type: Number
    },
    currentPage: {
      require: true,
      type: Number
    },
    pageSize: {
      type: Number,
      default() {
        return 10;
      }
    },
    hideOnlyOne: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      currentPageCopy: this.currentPage,
      frontNum: 1
    };
  },
  computed: {
    pageNum() {
      return Math.ceil(this.total / this.pageSize) || 1;
    },
    longPage() {
      return this.pageNum > 7;
    },
    pageTotal() {
      const pageNum = this.pageNum;
      let pageTotal;
      if (!this.longPage) {
        pageTotal = pageNum;
      } else {
        const n = this.frontNum;
        if (n === 1) {
          pageTotal = [1, 2, 3, 4, 5, 6, '...', pageNum];
          if (this.currentPageCopy > 6) {
            this.currentPageCopy = 6;
          }
        } else if (n > 1 && n + 4 < pageNum - 1) {
          pageTotal = [1, '...', n, n + 1, n + 2, n + 3, n + 4, '...', pageNum];
          if (this.currentPageCopy < n) {
            this.currentPageCopy = n;
          }
          if (this.currentPageCopy > n + 4) {
            this.currentPageCopy = n + 4;
          }
        } else if (n + 4 === pageNum - 1) {
          pageTotal = [1, '...', n, n + 1, n + 2, n + 3, n + 4, pageNum];
          if (this.currentPageCopy < n) {
            this.currentPageCopy = n;
          }
        }
      }
      return pageTotal;
    },
    hasPrevEllipsis() {
      return this.longPage && this.pageTotal[1] === '...';
    },
    hasNextEllipsis() {
      return this.longPage && this.pageTotal[this.pageTotal.length - 2] === '...';
    }
  },
  watch: {
    currentPageCopy(val) {
      this.$emit('current-change', val)
    }
  },
  methods: {
    changeCurrent(which, index) {
      switch (which) {
        case '...':
          this.checkMorePage(index === 1);
          break;
        
        case 'next':
          if (this.currentPageCopy < this.pageNum) {
            this.currentPageCopy++;
          }
          break;
        
        case 'prev':
          if (this.currentPageCopy > 1) {
            this.currentPageCopy--;
          }
          break;
      
        default:
          if (this.currentPageCopy !== which) {
            if (which === 1) {
              this.frontNum = 1;
            }
            if (which === this.pageNum) {
              this.frontNum = this.pageNum - 5;
            }
            this.currentPageCopy = which;
          }
          break;
      }
    },
    checkMorePage(isPrev) {
      let hasChange = false;
      if (isPrev) {
        if (this.frontNum === 3) {
          this.frontNum = 1;
        } else {
          this.frontNum--;
        }
      } else {
        if (!this.hasPrevEllipsis) {
          this.frontNum = 3;
        } else {
          this.frontNum++;
        }
      }
      return hasChange;
    }
  }
}
</script>

<style scoped>
.base-pagination-inner{
  display: inline-block;
  vertical-align: middle;
  margin-right: 1em;
}
.base-pagination-single{
  display: inline-block;
  width: 1em;
  text-align: center;
  background-color: #fff;
  padding: 5px;
  margin: 0 2px;
  border-radius: 2px;
  user-select: none;
}
.base-pagination-single.is-disabled{
  color: #ccc;
  cursor: not-allowed;
}
.base-pagination-single:not(.is-disabled):hover,
.base-pagination-single:not(.is-disabled):active
{
  color: #00BCD4;
}
.base-pagination-total{
  font-size: .8em;
  vertical-align: middle;
}
</style>
