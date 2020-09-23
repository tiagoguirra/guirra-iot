<template>
  <div class="page">
    <Header title="Devices" />
    <div class="device-list">
      <DeviceCard
        class="device"
        v-for="item in devices"
        :key="item.id"
        :name="item.name"
        :id="item.id"
        :category="item.category"
        :properties="item.properties"
      />
    </div>
    <transition name="slide-popup" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import Header from '@/components/Header'
import DeviceCard from './DeviceCard'
export default {
  name: 'Device',
  components: { Header, DeviceCard },
  data: () => ({
    devices: [
      {
        id: '0001',
        name: 'Fita de led',
        category: 'light_rgb',
        properties: ['color', 'power', 'brightness']
      },
      {
        id: '0002',
        name: 'Luz da sala',
        category: 'switch',
        properties: ['power']
      },
      {
        id: '00023',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '00024',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '000245',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '000552',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '0005552',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '0004452',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      },
      {
        id: '0008482',
        name: 'Luz da sala',
        category: 'light',
        properties: ['power']
      }
    ]
  })
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
    min-height: 200px;
  }
}
</style>
