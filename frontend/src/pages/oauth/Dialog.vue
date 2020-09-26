<template>
  <div class="page-fluid">
    <div class="header-full flex-column d-flex justify-center">
      <h1 class="subtitle">Authorize acess</h1>
      <h3 class="subtitle">{{ application }} request acess for your account</h3>
    </div>
    <div class="content-upheader d-flex justify-center">
      <v-card class="card-content card-auth" :elevation="3" outlined>
        <div class="loading-content" v-if="loading">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="70"
          ></v-progress-circular>
        </div>
        <template v-if="!loading && !error">
          <div class="subtitle">Request acess to</div>
          <v-divider></v-divider>
          <div class="scopes">
            <v-chip
              class="ma-4"
              color="success"
              text-color="white"
              v-for="item in scopes"
              :key="item.value"
            >
              {{ item.label }}
            </v-chip>
          </div>

          <v-btn
            class="btn-full"
            color="purple-dark-theme"
            rounded
            dark
            :loading="authorizeLoading"
            @click="onAuthorize"
            >Authorize</v-btn
          >
        </template>
        <div class="dialog-error" v-if="!loading && error">
          <div class="title">Sorry, something wrong!</div>
          <div class="subtitle">Paramter to client inválid</div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { AUTH_DIALOG, AUTH_AUTORIZE } from '@/store/actions/auth'
import * as _ from 'lodash'
import { mapGetters } from 'vuex'
import { OauthScopeLabel } from '../../types/oauth-scopes'

export default {
  name: 'OauthDialog',
  data: () => ({
    application: 'Alexa',
    loading: true,
    scopes: [],
    error: false,
    authorizeLoading: false,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  created() {
    const { client_id, redirect_uri, scope = '' } = this.$route.query
    if (this.isAuthenticated) {
      const scopes = scope.split(' ')
      this.scopes = scopes.map(item => ({
        label: _.get(OauthScopeLabel, item, item),
        value: item,
      }))
      this.$store
        .dispatch(AUTH_DIALOG, {
          client_id,
          redirect_uri,
        })
        .then(resp => {
          this.application = _.get(resp, 'name', 'Alexa')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.error = true
        })
    } else {
      const [, query] = this.$route.fullPath.split('?')
      this.$router.replace(`/login?after_login=${this.$route.path}&${query}`)
    }
  },
  methods: {
    onAuthorize() {
      const { client_id, redirect_uri, state, scope } = this.$route.query
      alert(scope)
      this.authorizeLoading = true
      this.$store
        .dispatch(AUTH_AUTORIZE, {
          client_id,
          redirect_uri,
          scopes: scope.split(' '),
        })
        .then(resp => {
          this.authorizeLoading = false
          this.$toasted.show('Redirecting...', { type: 'success' })

          setTimeout(
            () =>
              window.location.replace(
                `${_.get(resp, 'redirect_url')}?code=${_.get(
                  resp,
                  'code'
                )}&state=${state}&scope=${scope}`
              ),
            1000
          )
        })
        .catch(() => {
          this.authorizeLoading = false
          this.error = true
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
  margin-bottom: 15px;
}
</style>
