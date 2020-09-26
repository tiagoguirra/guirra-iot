<template>
  <div class="page-fluid">
    <Menu />
    <transition mode="out-in">
      <router-view class="child-view view-parent"></router-view>
    </transition>
  </div>
</template>

<script>
import Menu from '../components/Menu'
export default {
  name: 'Home',
  components: { Menu },
  data: () => ({}),
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-tab {
  justify-content: flex-start !important;
}
.v-tabs--vertical > .v-tabs-bar {
  flex: none !important;
}
.tab-conteudo {
  width: 100%;
  flex: 1;
  height: 100%;
}
</style>
