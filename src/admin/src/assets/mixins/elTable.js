export default {
  data() {
    return {
      tableOpt: {
        multiMode: false
      },
      curSelect: []
    };
  },
  watch: {
    'tableOpt.multiMode'(multi) {
      if (!multi) {
        this.clearRowSelect();
      }
    }
  },
  methods: {
    tableRowClass({ row, rowIndex }) {
      return row.selected ? 'light-primary-color text-primary-color' : '';
    },
    tableRowClick(row, e, col) {
      let curIdx = -1;

      for (let i = 0; i < this.curSelect.length; i++) {
        const item = this.curSelect[i];
        if (row._id === item._id) {
          curIdx = i;
          break;
        }
      }
      if (curIdx === -1) {
        if (this.tableOpt.multiMode) {
          this.curSelect.push(row);
        } else {
          this.curSelect.forEach(row => {
            this.$set(row, 'selected', false);
          });
          this.curSelect = [row];
        }
        this.$set(row, 'selected', true);
      } else {
        this.curSelect.splice(curIdx, 1);
        this.$set(row, 'selected', false);
      }
    },
    clearRowSelect() {
      this.curSelect.forEach(row => {
        this.$set(row, 'selected', false);
      });
      this.curSelect = [];
    }
  }
};
