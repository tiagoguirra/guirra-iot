<template>
  <div class="page page-login">
    <div class="page-title">
      Guirra IOT
    </div>
    <v-card class="login-card" :elevation="3" outlined dark>
      <v-text-field
        v-model="username"
        outlined
        dense
        dark
        label="Username"
      ></v-text-field>
      <v-text-field
        v-model="password"
        outlined
        dense
        dark
        :type="visibled ? 'text' : 'password'"
        :append-icon="visibled ? 'fas fa-eye' : 'fas fa-eye-slash'"
        label="Password"
        @click:append="visibled = !visibled"
      ></v-text-field>
      <v-btn class="btn-login" color="success" rounded>Login</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    visibled: false
  })
}
</script>

<style lang="scss">
.page-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 80px;
  .page-title {
    color: #fff;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  .login-card {
    width: 400px;
    padding: 20px 15px;
    border-radius: 10px;
  }
  .btn-login {
    width: 100%;
  }
}
</style>
