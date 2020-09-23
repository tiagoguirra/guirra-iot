import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../pages/Home.vue'
import Device from '../pages/device/Device.vue'
import DeviceSettings from '../pages/device/Settings.vue'
import OauthLogin from '../pages/oauth/Login.vue'
import OauthDialog from '../pages/oauth/Dialog.vue'
import { ifAuthenticated, ifNotAuthenticated } from './guards'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Devices',
        redirect: 'devices',
      },
      {
        path: 'devices',
        name: 'DevicesList',
        component: Device,
        children: [
          {
            path: ':id',
            name: 'DeviceDetails',
            component: DeviceSettings,
          },
          {
            name: 'DeviceSettings',
            path: ':id/settings',
            component: DeviceSettings,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: ifNotAuthenticated,
    component: OauthLogin,
  },
  {
    path: '/oauth/dialog',
    name: 'OauthDialod',
    component: OauthDialog,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
