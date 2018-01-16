<template>
  <div class="base-pagination">
    <ul class="base-pagination-inner">
      <li
        :class="{
          'base-pagination-single': true,
          'is-disabled': currentPageCopy === 1
        }"
        @click="changeCurrent('prev')">&lt;</li>
      <li
        :class="{
          'base-pagination-single': true,
          'active-color': n === currentPageCopy
        }"
        v-for="(n, index) in pageTotal"
        :key="index+n"
        @click="changeCurrent(n, index)">{{n}}</li>
      <li
        :class="{
          'base-pagination-single': true,
          'is-disabled': currentPageCopy === pageTotal
        }"
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
    showTotal: {

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
        } else if (n > 1 && n + 4 < pageNum - 1) {
          pageTotal = [1, '...', n, n + 1, n + 2, n + 3, n + 4, '...', pageNum];
        } else if (n + 4 === pageNum - 1) {
          pageTotal = [1, '...', n, n + 1, n + 2, n + 3, n + 4, pageNum];
        }
      }
      return pageTotal;
    },
    hasPrevEllipsis() {
      return this.longPage && this.pageTotal[1] === '...';
    },
    hasNextEllipsis() {
      return this.longPage && this.pageTotal[this.pageTotal.length - 2] === '...';
    },
    reachFront() {
      if (this.hasPrevEllipsis && this.pageTotal[2] === this.currentPageCopy) {
        return true;
      }
      if (!this.hasPrevEllipsis && this.pageTotal[0] === this.currentPageCopy) {
        return true;
      }
      return false;
    },
    reachEnd() {
       if (this.hasNextEllipsis && this.pageTotal[this.pageTotal.length - 3] === this.currentPageCopy) {
        return true;
      }
      if (!this.hasNextEllipsis && this.pageTotal[this.pageTotal.length - 1] === this.currentPageCopy) {
        return true;
      }
      return false;
    }
  },
  methods: {
    changeCurrent(which, index) {
      let hasChange = false;
      switch (which) {
        case '...':
          hasChange = this.checkMorePage(index === 1);
          break;
        
        case 'next':
          if (this.currentPageCopy < this.pageNum) {
            this.currentPageCopy++;
            hasChange = true;
          }
          break;
        
        case 'prev':
          if (this.currentPageCopy > 1) {
            this.currentPageCopy--;
            hasChange = true;
          }
          break;
      
        default:
          if (this.currentPageCopy !== which) {
            this.currentPageCopy = which;
            hasChange = true;
          }
          break;
      }
      hasChange && this.$emit('current-change', this.currentPageCopy);
    },
    checkMorePage(isPrev) {
      let hasChange = false;
      if (isPrev) {
        if (this.reachFront) {
          if (this.frontNum === 3) {
            this.frontNum = 1;
          } else {
            this.frontNum--;
          }
          hasChange = true;
        } else {
          this.currentPageCopy--;
        }
      } else {
        if (this.reachEnd) {
          if (!this.hasPrevEllipsis) {
            this.frontNum = 3;
          } else {
            this.frontNum++;
          }
          hasChange = true;
        } else {
          this.currentPageCopy++;
        }
      }
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
