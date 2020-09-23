<template>
  <div class="page-header">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  padding-bottom: 5px;
  margin-bottom: 25px;
  color: #fff;
  font-size: 30px;
  text-align: left;
  display: block;
  flex: 1 1 0px;
  max-width: 100%;
  border-bottom: thin solid rgba(255, 255, 255, 0.12);
  .title,
  .subtitle {
    width: 100%;
  }
  .subtitle {
    font-size: 14px;
  }
}
</style>
