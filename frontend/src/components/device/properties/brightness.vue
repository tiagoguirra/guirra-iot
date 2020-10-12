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
        @change="changeDebounced"
      ></v-slider>
    </div>
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
import * as _ from 'lodash'

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
  data: () => ({
    changeDebounced: null,
  }),
  created() {
    this.changeDebounced = _.debounce(value => this.onChange(value), 500)
  },
}
</script>

<style lang="scss"></style>
