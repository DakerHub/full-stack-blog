export default {
  data() {
    return {
      curPage: 1,
      pageSize: 20,
      total: 0
    };
  },
  methods: {
    sizeChange(page) {
      this.pageSize = page;
      this.getList();
    },
    currentPageChange(cur) {
      this.curPage = cur;
      this.getList();
    }
  }
};
