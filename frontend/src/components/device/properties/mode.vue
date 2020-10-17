<template>
  <div class="device-property mode">
    <v-select
      v-model="model"
      dark
      :items="options"
      dense
      :label="$t(type) || type"
      outlined
      @change="onChange"
    />
  </div>
</template>

<script>
import propertyMixin from './propertyMixin.vue'
import * as _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'mode',
  props: {
    deviceId: String,
    type: String,
    values: {
      type: Array,
      default: () => [],
    },
    initial: String,
  },
  data: () => ({
    model: null,
  }),
  created() {
    this.model = this.initial
  },
  watch: {
    deviceStatus: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.model = _.get(this.deviceStatus, 'value')
        }
      },
    },
  },
  computed: {
    ...mapGetters(['getDeviceModeStatus']),
    deviceStatus() {
      return this.getDeviceModeStatus(this.deviceId, this.type)
    },
    options() {
      return this.values.map(item => ({
        text: this.$t(item) || item,
        value: item,
      }))
    },
  },
  methods: {
    onChange() {
      this.$emit('change', { value: this.model, property: this.type })
    },
  },
}
</script>

<style></style>
