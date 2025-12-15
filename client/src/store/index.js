import { createStore } from 'vuex'
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export default createStore({
  state() {
    return {
      locations: [],
      loading: false,
      error: null,
    }
  },

  mutations: {
    SET_LOCATIONS(state, locations) {
      state.locations = Array.isArray(locations) ? locations : []
    },

    ADD_LOCATION(state, location) {
      state.locations.unshift(location)
    },

    SET_LOADING(state, value) {
      state.loading = Boolean(value)
    },

    SET_ERROR(state, message) {
      state.error = message || null
    },
  },

  actions: {
    async fetchLocations({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const { data } = await api.get('/api/locations')
        commit('SET_LOCATIONS', data)
        return data
      } catch (err) {
        console.error('Failed to load locations:', err)
        commit('SET_ERROR', 'Failed to load locations')
        throw err
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async saveLocation({ commit }, { latitude, longitude, fullAddress }) {
      commit('SET_ERROR', null)

      const lat = Number(latitude)
      const lng = Number(longitude)

      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !fullAddress) {
        const err = new Error('Invalid payload')
        commit('SET_ERROR', 'Failed to save location')
        throw err
      }

      try {
        const { data: saved } = await api.post('/api/locations', {
          latitude: lat,
          longitude: lng,
          address: fullAddress,
        })

        commit('ADD_LOCATION', saved)
        return saved
      } catch (err) {
        console.error('Failed to save location:', err)
        commit('SET_ERROR', 'Failed to save location')
        throw err
      }
    },
  },
})
