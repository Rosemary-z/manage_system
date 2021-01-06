import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data() {
      return {
        activeTitle: []
      }
    }
  },
  mutations: {
    activeTitleMut(state, activeTitle) {
      state.activeTitle = activeTitle
    },
  },
  actions: {},
  modules: {}
})