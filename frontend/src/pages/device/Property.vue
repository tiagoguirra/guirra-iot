<template>
  <div class="device-property">
    <component
      @change="onChange"
      :is="type"
      v-model="model"
      :category="category"
      :state="state"
      :type="type"
    />
  </div>
</template>

<script>
import color from './properties/color'
import brightness from './properties/brightness'
import power from './properties/power'

export default {
  name: 'DeviceProperty',
  components: { color, power, brightness },
  props: {
    value: [String, Number, Array, Object],
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
  },
  data: () => ({
    model: ''
  }),
  watch: {
    value: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.model = this.value
        }
      }
    }
  },
  created() {
    this.model = this.value
  },
  methods: {
    onChange() {
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    }
  }
}
</script>

<style lang="scss">
.device-property {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 5px;
  .v-messages {
    display: none !important;
  }
  .v-input__slot {
    margin: 0 !important;
  }
 
  .action-label {
    font-size: 14px;
    width: 100%;
    min-width: 100%;
    flex: 1;
    color: #fff;
    text-align: center;
  }
  .device-action {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.device-ico {
  color: rgba(255, 255, 255, 0.5);
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &.active {
    color: #fff;
  }
}
</style>
