<template>
  <v-card class="device-card" :elevation="1" outlined dark @click="onClick">
    <div class="device-header">
      <div class="device-name">{{ name }}</div>
      <v-menu class="device-options" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon small rounded v-on="on">
            <v-icon size="15">fas fa-ellipsis-v</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="device-content">
      <DeviceProperty
        :device-id="deviceId"
        :id="'default-' + deviceId"
        :category="category"
        :type="defaultProp"
        @change="onChange"
      />
    </div>
    <div class="device-footer">
      <div class="device-category">{{ categoryName }}</div>
    </div>
  </v-card>
</template>

<script>
import DeviceProperty from './Property'
import { categoryLabel, defaultProperty } from '@/types/device-types'
import Api from '../../services/api'
import { DEVICE_STATUS, DEVICE_CHANGE } from '@/store/actions/device'
import { mapGetters } from 'vuex'
import * as _ from 'lodash'
export default {
  name: 'DeviceCard',
  components: { DeviceProperty },
  props: {
    deviceId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    properties: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data: () => ({
    state: {},
    interval: null,
  }),
  watch: {
    deviceStatus: {
      deep: true,
      handler(newValue) {
        const state = _.find(newValue, { property: this.defaultProp })
        this.state = _.get(state, 'state')
      },
    },
  },
  computed: {
    categoryName() {
      return categoryLabel[this.category] || 'Switch'
    },
    defaultProp() {
      return defaultProperty[this.category] || 'power'
    },
  },
  created() {
    this.getSatus()
    this.interval = setInterval(() => this.getSatus(), 10000)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    getSatus() {
      this.$store.dispatch(DEVICE_STATUS, { deviceId: this.deviceId })
    },
    onClick(e) {
      const powerEl = document.querySelector(
        `#default-${this.deviceId} .action-btn`
      )
      if (!powerEl.contains(e.target)) {
        this.$emit('click', this.deviceId)
      }
    },
    onChange({ value, property }) {
      this.$store.dispatch(DEVICE_CHANGE, {
        deviceId: this.deviceId,
        value,
        property,
      })
    },
  },
}
</script>

<style lang="scss">
.device-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  transition: all 0.3 ease-in-out;
  &.hover {
    transform: scale(1.1);
    z-index: 100;
    .device-content .prop-item {
      clip-path: circle(100% at 50% 50%);
      opacity: 1;
      height: inherit;
    }
  }
  .device-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    .device-name {
      font-size: 18px;
    }
  }
  .device-content {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    .prop-item {
      clip-path: circle(0.5% at 50% 1%);
      opacity: 0;
      height: 0;
      transition: all 0.3s ease-in-out;
    }
  }
  .device-footer {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.5);
    .device-category,
    .device-state {
      width: 100%;
      text-align: left;
      font-size: 14px;
    }
    .device-state {
      font-size: 12px;
    }
  }
}
</style>
