<template>
  <div class="device-property">
    <div class="action-label">
      Power
    </div>
    <div
      class="action-btn  power-btn"
      :class="{ active: isActive }"
      :style="iconStyle"
      @click="toggle"
    >
      <v-icon size="30">{{ icon }}</v-icon>
    </div>
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
export default {
  name: 'power',
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
    model: '',
  }),
  computed: {
    isActive() {
      if (this.type === 'lock') {
        return this.model === 'LOCKED'
      }
      return this.model === 'ON'
    },
  },
}
</script>

<style lang="scss">
.power-btn {
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #686869;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #686869;
  transition: all 0.3s ease-in-out;
  i {
    color: #8d8e8f !important;
    transition: all 0.3s ease-in-out;
  }
  &.active {
    border-color: #fff;
    i {
      color: #fff !important;
    }
  }
}
</style>
