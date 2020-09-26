<template>
  <v-app-bar color="purple-theme" dense dark>
    <div class="container d-flex space-between align-center">
      <v-toolbar-title>Guirra IOT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/devices">
        <v-icon size="15">fas fa-grip-horizontal</v-icon></v-btn
      >
      <v-btn icon
        ><v-icon size="15" @click="logOut">fas fa-sign-out-alt</v-icon></v-btn
      >
    </div>
  </v-app-bar>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth'
export default {
  name: 'Menu',
  methods: {
    logOut() {
      this.$store.dispatch(AUTH_LOGOUT)
      setTimeout(() => this.$router.push('/login'), 200)
    },
  },
}
</script>

<style></style>
