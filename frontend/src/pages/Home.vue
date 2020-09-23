<template>
  <v-tabs
    class="tab-main"
    background-color="#1c1c1c"
    dark
    vertical
    v-model="tab"
  >
    <v-tabs-slider></v-tabs-slider>
    <v-tab class="tab-titulo" key="tab-control" link to="/devices">
      Devices
    </v-tab>
    <v-tabs-items class="tab-conteudo">
      <transition mode="out-in">
        <router-view class="child-view view-parent"></router-view>
      </transition>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    tab: '/'
  })
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
