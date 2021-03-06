import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';

Vue.use(Vuex)

const store = new Vuex.Store({
//export default new Vuex.Store({
  state: {
    token:  localStorage.getItem('token') || '',
    status: '',
    user_id: localStorage.getItem('user_id') || '',
    user: {}
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success'
      state.token = token.token
      state.user = token.usuario
      state.user_id = token.usuario.id
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({ commit }, user) {
      var promise = new Promise((resolve, reject) => {
        if (user.user.id && user.token) {
          commit('auth_request')
          localStorage.setItem('token', user.token)
          localStorage.setItem('user_id', user.user.id)
          axios.defaults.headers.common['Authorization'] = user.token
          commit('auth_success', {token: user.token, usuario: user.user})
        }
        else {
          commit('auth_error')
          localStorage.removeItem('user_id',)
          localStorage.removeItem('token')
          reject(Error())
        }
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('user_id',)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
  }
})

export default store;