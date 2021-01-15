import Vue from 'vue'
import Vuex from 'vuex'
import getAttr_Id from '@/store/getAttr_Id'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    getAttr_Id,
  }
})