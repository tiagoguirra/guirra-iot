import Vue from 'vue'
import Vuex from 'vuex'
import modules, { AppStore } from './modules'

Vue.use(Vuex)

export default new Vuex.Store<AppStore>({ modules })
