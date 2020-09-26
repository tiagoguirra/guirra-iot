<template>
  <div class="device-property color">
    <div class="action-label">
      Color
    </div>
    <div class="device-action">
      <color-picker v-bind="color" @input="changeColor" />
    </div>
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
import * as _ from 'lodash'
import ColorPicker from '@radial-color-picker/vue-color-picker'
import { hslToRgb, rgbToHsl } from '../../../libraries/color'

export default {
  name: 'color',
  mixins: [propertyMixin],
  components: { ColorPicker },
  props: {
    deviceId: String,
    category: {
      type: String,
      required: true,
    },
    type: String,
  },
  data: () => ({
    model: null,
    color: {
      hue: 50,
      saturation: 100,
      luminosity: 50,
    },
    changeColor: () => '',
  }),
  watch: {
    model: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          const color = rgbToHsl(
            _.get(newVal, 'red', 0),
            _.get(newVal, 'green', 0),
            _.get(newVal, 'blue', 0)
          )
          this.color = {
            hue: _.get(color, 'hue', 0),
            saturation: _.get(color, 'saturation', 100),
            luminosity: _.get(color, 'luminosity', 50),
          }
        }
      },
    },
  },
  created() {
    this.changeColor = _.debounce(hue => this.onChangeColor(hue), 500)
  },
  methods: {
    onChangeColor(hue) {
      this.color.hue = hue
      const color = hslToRgb(
        this.color.hue,
        this.color.saturation || 100,
        this.color.luminosity || 50
      )
      if (color !== this.model) {
        this.model = color
        this.onChange()
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
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
