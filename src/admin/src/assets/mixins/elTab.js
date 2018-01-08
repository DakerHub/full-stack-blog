export default {
  methods: {
    addTab(targetName, route) {
      const store = this.$store;
      const { tabs } = store.state;
      let sameTab = false;
      let existIdx = -1;
      tabs.forEach(function (tab, index) {
        if (tab.route === route) {
          existIdx = index;
          sameTab = true;
        }
      });
      if (sameTab) {
        store.commit('setActivedTab', tabs[existIdx].name);
        this.$router.push({ path: route });
      } else {
        store.commit('increaseTab');
        const newTabName = store.state.tabIndex + '';
        store.commit('pushTab', {
          title: targetName,
          name: newTabName,
          route,
          closable: true
        });
        store.commit('setActivedTab', newTabName);
        this.$router.push({ path: route });
      }
    },
    removeTab(targetName) {
      const store = this.$store;
      const { tabs } = store.state;
      let { activedTab } = store.state;
      if (activedTab === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activedTab = nextTab.name;
              this.$router.push({ path: nextTab.route });
            }
          }
        });
      }
      store.commit('setActivedTab', activedTab);
      store.commit('removeTab', targetName);
    },
    changeView($tab) {
      const { tabs } = this.$store.state;
      let activeTab = null;
      tabs.forEach(function (tab, index) {
        if ($tab.name === tab.name) {
          activeTab = tab;
        }
      });
      this.$router.push({ path: activeTab.route });
    }
  }
};
