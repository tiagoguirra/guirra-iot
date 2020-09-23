<template>
  <div class="content-view">
    <div class="container-page">
      <transition mode="out-in">
        <router-view class="child-view view-parent"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Content',
  computed: {},
};
</script>

<style lang="scss" scoped>
.content-view {
  width: 100%;
  min-height: 100vh;
  transition: all 0.3s ease-in-out;
}
// @media (max-width: 768px) {
//   .content-view {
//     padding-left: 0px;
//   }
// }
</style>
