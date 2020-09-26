<template>
  <div class="device-property">
    <div class="action-label">
      Brightness
    </div>
    <div class="device-action">
      <v-slider
        class="action-btn "
        :min="1"
        :max="100"
        thumb-label
        :thumb-size="24"
        v-model="model"
        @change="onChange"
      ></v-slider>
    </div>
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
export default {
  name: 'brightness',
  mixins: [propertyMixin],
  props: {
    deviceId: String,
    category: {
      type: String,
      required: true,
    },
    type: String,
  },
}
</script>

<style lang="scss"></style>
