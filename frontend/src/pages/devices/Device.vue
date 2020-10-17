<template>
  <SidePopup
    :loading="loading"
    :title="title"
    @submit="onSubmit"
    @close="onClose"
    overlayNotBack
  >
    <template v-slot:options>
      <v-menu bottom>
        <template v-slot:activator="{ on }">
          <v-btn dark icon small rounded v-on="on">
            <v-icon size="15">fas fa-ellipsis-v</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="editMode = true">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-if="device && !editMode">
      <DeviceProperty
        :device-id="device.device_id"
        :id="'default-' + device.device_id"
        :category="category"
        :type="defaultProp"
        @change="onChange"
      />
      <DeviceProperty
        v-for="item in properties"
        :key="item.name + '-' + device.device_id"
        :device-id="device.device_id"
        :id="item.name + '-' + device.device_id"
        :category="category"
        :type="item.name"
        @change="onChange"
      />

      <DeviceMode
        v-for="item in modes"
        :key="item.name + '-' + device.device_id"
        :device-id="device.device_id"
        :id="item.name + '-' + device.device_id"
        :type="item.name"
        :values="item.values"
        :initial="item.initial"
        @change="onChange"
      />
    </template>
    <template v-if="device && editMode">
      <v-text-field
        v-model="device.name"
        outlined
        dense
        dark
        label="Device name"
      ></v-text-field>
      <v-select
        v-model="device.category"
        placeholder="category"
        dark
        :items="categoriesList"
        dense
        label="Category"
        outlined
        multiple
      />
    </template>
    <template v-slot:buttons>
      <v-btn color="success" rounded type="submit" v-if="editMode">Save</v-btn>
    </template>
  </SidePopup>
</template>

<script>
import SidePopup from '@/components/SidePopup'
import {
  DEVICE_GET,
  DEVICE_CHANGE,
  DEVICE_UPDATE,
  DEVICE_STATUS,
} from '@/store/actions/device'
import * as _ from 'lodash'
import DeviceProperty from '@/components/device/Property'
import DeviceMode from '@/components/device/properties/mode'

import {
  defaultProperty,
  categoryLabel,
  categories,
  pulseSuport,
  pulseValues,
} from '@/types/device-types'

export default {
  components: { SidePopup, DeviceProperty, DeviceMode },
  data: () => ({
    deviceId: '',
    device: '',
    editMode: false,
    loading: false,
  }),
  computed: {
    title() {
      return _.get(this.device, 'name')
    },
    category() {
      return _.get(this.device, 'category.0', '')
    },
    categoryName() {
      return categoryLabel[this.category] || 'Switch'
    },
    defaultProp() {
      return defaultProperty[this.category] || 'power'
    },
    properties() {
      return _.get(this.device, 'properties', []).filter(
        item => item.name !== this.defaultProp
      )
    },
    modes() {
      return _.get(this.device, 'modes', [])
    },
    categoriesList() {
      return categories.map(item => ({
        text: categoryLabel[item],
        value: item,
      }))
    },
  },
  created() {
    this.deviceId = this.$route.params.id
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.$store
        .dispatch(DEVICE_GET, { deviceId: this.deviceId })
        .then(device => {
          this.device = device
          this.loading = false
          this.$store.dispatch(DEVICE_STATUS, { deviceId: this.deviceId })
        })
        .catch(() => (this.loading = false))
    },
    onChange({ value, property }) {
      this.$store.dispatch(DEVICE_CHANGE, {
        deviceId: this.deviceId,
        value,
        property,
      })
    },
    onSubmit() {
      this.loading = true
      this.$store
        .dispatch(DEVICE_UPDATE, {
          device_id: this.device.device_id,
          name: this.device.name,
          category: this.device.category || [],
        })
        .then(() => {
          this.loading = false
          this.editMode = false
          this.getData()
        })
        .catch(() => (this.loading = false))
    },
    onClose() {
      if (this.editMode) {
        this.editMode = false
      } else {
        this.$router.push('/devices')
      }
    },
  },
}
</script>

<style></style>
