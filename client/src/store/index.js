// store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    // apiBaseURL: 'http://localhost:8000/',
    // это для прода (потом наверное с сборкой буду делать и ENV добавлю для прода и дева) это пока времено и коменитьь что да как нужно
    apiBaseURL: 'http://31.130.151.240:8000/'
  },
  getters: {
    getApiBaseURL: (state) => state.apiBaseURL,
  },
  mutations: {
    setApiBaseURL(state, url) {
      state.apiBaseURL = url;
    },
  },
  actions: {
    // GET запрос с col
    async getDataList({ state }, { col, params }) {
      try {
        const response = await axios.get(`${state.apiBaseURL}${col}`, { params });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // POST запрос
    async createDataList({ state }, { col, data }) {
      try {
        const response = await axios.post(`${state.apiBaseURL}${col}`, data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // PUT запрос
    async updateDataList({ state }, { col, data }) {
      try {
        const response = await axios.put(`${state.apiBaseURL}${col}`, data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // DELETE запрос
    async deleteDataList({ state }, { col, data }) {
      try {
        const response = await axios.delete(`${state.apiBaseURL}${col}`, { data });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});

export default store;