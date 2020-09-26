<template>
  <div class="device-property">
    <component
      @change="onChange"
      :is="type"
      :category="category"
      :device-id="deviceId"
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
  components: { color, power, brightness, lock: power },
  props: {
    deviceId: String,
    type: String,
    category: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    },
  },
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
