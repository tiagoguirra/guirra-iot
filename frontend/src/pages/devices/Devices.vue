<template>
  <div>
    <div class="header-full flex-column d-flex justify-center">
      <h1 class="subtitle">IOT Devices</h1>
    </div>
    <div class="content-upheader">
      <div class="container">
        <div class="device-list d-flex justify-center">
          <DeviceCard
            class="device"
            v-for="item in getDevices"
            :key="item.device_id"
            :name="item.name"
            :device-id="item.device_id"
            :category="item.category[0]"
            :properties="item.properties"
            @click="onClick(item)"
            :class="{
              open: deviceShow && deviceShow.device_id === item.device_id,
            }"
          />
        </div>
      </div>
    </div>
    <transition name="slide-popup" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import DeviceCard from '@/components/device/DeviceCard'
import { DEVICE_LIST } from '@/store/actions/device'
import { mapGetters } from 'vuex'
export default {
  name: 'Devices',
  components: { DeviceCard },
  computed: {
    ...mapGetters(['getDevices', 'getDevicePagination']),
  },
  data: () => ({
    deviceShow: null,
  }),
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$store.dispatch(DEVICE_LIST)
    },
    onClick(device) {
      this.$router.push(`/devices/${device.device_id}`)
    },
  },
}
</script>

<style lang="scss">
.device-list {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .device {
    flex: 1;
    min-width: 250px;
    max-width: 300px;
    flex-grow: 0;
    min-height: 200px;
    margin: 2px;
  }
}
</style>
