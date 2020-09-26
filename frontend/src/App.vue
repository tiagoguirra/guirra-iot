<template>
  <v-app>
    <div id="app" class="main-stage">
      <transition mode="out-in">
        <router-view class="child-view view-parent"></router-view>
      </transition>
    </div>
  </v-app>
</template>
<script>
export default {
  name: 'App',
  data: () => ({
    toastConfig: {
      toastContainerId: 1,
      animation: 'ease-out-right',
      preventDuplicates: true,
      showCloseButton: true,
    },
  }),
}
</script>
<style lang="scss">
@import '@/assets/css/global.scss';
@import '@/assets/css/toast.scss';
@import '@/assets/css/sweet-alert.scss';
@import '@/assets/css/grid.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-stage {
  background: #1c1c1c;
  color: #1c1c1c;
  min-height: 100vh;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
}
.slide-popup-enter-active,
.slide-popup-leave-active,
.slide-pages-enter-active,
.slide-pages-leave-active {
  transition-duration: 0.4s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-popup-enter {
  opacity: 0;
  transform: translate(2em, 0);
}
.slide-popup-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}
.slide-pages-enter {
  opacity: 0;
}
.slide-pages-leave-active {
  opacity: 0;
}
</style>
