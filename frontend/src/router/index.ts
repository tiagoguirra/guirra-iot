import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../pages/Home.vue'
import Devices from '../pages/devices/Devices.vue'
import OauthLogin from '../pages/oauth/Login.vue'
import OauthDialog from '../pages/oauth/Dialog.vue'
import { ifAuthenticated, ifNotAuthenticated } from './guards'
import Device from '../pages/devices/Device.vue'

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
        component: Devices,
        children: [
          {
            path: ':id',
            name: 'Device',
            component: Device,
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
