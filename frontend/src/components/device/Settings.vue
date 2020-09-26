<template>
  <SidePopup :title="title" v-on:close="onClose" @submit="onSubmit">
    <template v-slot:options>
      <v-menu bottom>
        <template v-slot:activator="{ on }">
          <v-btn dark icon small rounded v-on="on">
            <v-icon size="15">fas fa-ellipsis-v</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            :to="'/devices/' + device.id + '/settings'"
            v-if="!isSettings"
          >
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item :to="'/devices/' + device.id" v-if="isSettings">
            <v-list-item-title>Controller</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <div class="device-properties" v-if="!isSettings">
      <DeviceProperty
        :category="device.category"
        :type="defaultProp"
        v-model="state[defaultProp]"
        :state="state"
      />
      <template v-for="item in listProperties">
        <DeviceProperty
          :key="item"
          :category="device.category"
          :type="item"
          v-model="state[item]"
          :state="state"
        />
      </template>
    </div>
    <div class="device-settings" v-if="isSettings">
      <v-text-field
        v-model="config.device_name"
        outlined
        dense
        dark
        label="Device name"
      ></v-text-field>
      <v-select
        :value="device.category"
        placeholder="category"
        disabled
        readonly
        dark
        :items="categoriesList"
        dense
        label="Category"
        outlined
      />

      <v-select
        v-model="config.pulse"
        placeholder="Pulso"
        dark
        :items="valuesPulse"
        dense
        label="Pulso"
        outlined
        v-if="supportPulse"
      />
      <p class="section-title">Initial state</p>
      <v-divider dark></v-divider>
      <DeviceProperty
        :category="device.category"
        :type="defaultProp"
        v-model="initial[defaultProp]"
        :state="initial"
      />
      <template v-for="item in listProperties">
        <DeviceProperty
          :key="item"
          :category="device.category"
          :type="item"
          v-model="initial[item]"
          :state="initial"
        />
      </template>
    </div>
    <template v-slot:buttons>
      <v-btn color="success" rounded v-if="isSettings">Save</v-btn>
    </template>
  </SidePopup>
</template>

<script>
import SidePopup from '@/components/SidePopup'
import DeviceProperty from './Property'
import {
  defaultProperty,
  categoryLabel,
  categories,
  pulseSuport,
  pulseValues
} from '@/types/device-types'

export default {
  name: 'Settings',
  components: { SidePopup, DeviceProperty },
  data: () => ({
    device: {
      id: '0001',
      name: 'Fita de led',
      category: 'light_rgb',
      properties: ['color', 'power', 'brightness']
    },
    state: {},
    config: {
      device_name: 'Fita de led',
      pulse: 0
    },
    initial: {}
  }),
  computed: {
    title() {
      return this.device.name
    },
    categoryName() {
      return categoryLabel[this.device.category] || 'Switch'
    },
    defaultProp() {
      return defaultProperty[this.device.category] || 'power'
    },
    listProperties() {
      return this.device.properties.filter(p => p !== this.defaultProp)
    },
    isSettings() {
      return this.$route.path.endsWith('/settings')
    },
    categoriesList() {
      return categories.map(item => ({
        text: categoryLabel[item],
        value: item
      }))
    },
    supportPulse() {
      return pulseSuport[this.device.category] || false
    },
    valuesPulse() {
      const values = pulseValues.map(value => ({
        text: `${value} s`,
        value: value
      }))
      return [
        {
          text: 'No pulse',
          value: 0
        },
        ...values
      ]
    }
  },
  created() {
    const deviceId = this.$route.params.id
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onSubmit() {
      return ''
    }
  }
}
</script>

<style lang="scss">
.device-properties {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .property-label {
    width: 100%;
    text-align: center;
    color: #fff;
  }
}
.section-title {
  width: 100%;
  text-align: center;
  color: #fff;
}
</style>
