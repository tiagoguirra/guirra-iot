<template>
  <div class="page-fluid">
    <div class="header-full flex-column d-flex justify-center">
      <h1 class="subtitle">Login IOT</h1>
    </div>
    <div class="content-upheader d-flex justify-center">
      <v-card class="card-content card-auth" :elevation="3" outlined>
        <form @submit.prevent="onSubmit">
          <v-text-field
            v-model="username"
            outlined
            dense
            label="Username"
          ></v-text-field>
          <v-text-field
            v-model="password"
            outlined
            dense
            :type="visibled ? 'text' : 'password'"
            :append-icon="visibled ? 'fas fa-eye' : 'fas fa-eye-slash'"
            label="Password"
            @click:append="visibled = !visibled"
          ></v-text-field>
          <v-btn
            class="btn-full"
            color="purple-dark-theme"
            dark
            rounded
            :loading="loading"
            type="submit"
            >Login</v-btn
          >
        </form>
      </v-card>
    </div>
  </div>
</template>

<script>
import { AUTH_LOGIN } from '@/store/actions/auth'
export default {
  name: 'OauthDialog',
  data: () => ({
    loading: false,
    username: '',
    password: '',
    visibled: false,
    redirect: '/',
  }),
  created() {
    const { after_login } = this.$route.query
    if (after_login) {
      this.redirect = after_login
      let queryString = ''
      for (const key in this.$route.query) {
        if (key !== 'after_login') {
          queryString = queryString ? queryString + '&' : queryString + '?'
          queryString += `${key}=${this.$route.query[key]}`
        }
      }
      this.redirect += queryString
    } else {
      this.redirect = '/'
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.$store
        .dispatch(AUTH_LOGIN, {
          email: this.username,
          password: this.password,
        })
        .then(() => {
          this.loading = false
          console.log(this.redirect)
          this.$router.push(this.redirect)
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
.scopes {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
</style>
