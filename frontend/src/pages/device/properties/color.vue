<template>
  <div class="device-property color">
    <div class="action-label">
      Color
    </div>
    <div class="device-action">
      <v-color-picker
        class="action-btn color-selector"
        hide-mode-switch
        hide-inputs
        canvas-height="100"
        light
        dark
        :mode="'rgba'"
        v-model="model"
        @update:color="onChange"
      ></v-color-picker>
    </div>
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
export default {
  name: 'color',
  mixins: [propertyMixin],
  props: {
    value: Object,
    type: String,
    category: {
      type: String,
      required: true
    },
    state: {
      type: Object,
      default: () => ({}),
      required: false
    }
  }
}
</script>

<style lang="scss">
.device-property.color {
  .device-action {
    padding-top: 10px;
  }
  .color-selector {
    width: 100%;
    .v-color-picker__controls {
      padding-bottom: 5px !important;
      padding-top: 5px !important;
    }
  }
}
</style>
