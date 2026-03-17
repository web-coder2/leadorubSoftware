import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    // apiBaseURL: 'http://localhost:3000/',
    apiBaseURL: 'http://31.130.151.240:3000/',
    userObject: null,
  },
  getters: {
    getApiBaseURL: (state) => state.apiBaseURL,
    getUserObject: (state) => state.userObject,
  },
  mutations: {
    setApiBaseURL(state, url) {
      state.apiBaseURL = url
    },
    setUserObject(state, userObject) {
      state.userObject = userObject
      // сохраняем в localStorage
      if (userObject) {
        localStorage.setItem('userObject', JSON.stringify(userObject))
      } else {
        localStorage.removeItem('userObject')
      }
    },
    clearUserObject(state) {
      state.userObject = null
      localStorage.removeItem('userObject')
    },
  },
  actions: {
    // GET запрос
    async getDataList({ state }, { col, params }) {
      try {
        const response = await axios.get(`${state.apiBaseURL}${col}`, { params })
        return response.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    // POST запрос
    async createDataList({ state }, { col, data }) {
      try {
        const response = await axios.post(`${state.apiBaseURL}${col}`, data)
        return response.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    // PUT запрос
    async updateDataList({ state }, { col, data }) {
      try {
        const response = await axios.put(`${state.apiBaseURL}${col}`, data)
        return response.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    // DELETE запрос
    async deleteDataList({ state }, { col, data }) {
      try {
        const response = await axios.delete(`${state.apiBaseURL}${col}`, { data })
        return response.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
})

// Инициализация userObject из localStorage при старте
const storedUser = localStorage.getItem('userObject')
if (storedUser) {
  store.commit('setUserObject', JSON.parse(storedUser))
}

export default store