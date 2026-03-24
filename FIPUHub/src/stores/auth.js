import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api_axios from '@/api/axios.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoggedIn = computed(() => !!token.value) // ista stvar kao i ovo: token.value !== null samo krace

  async function login(email, password) {
    const { data } = await api_axios.post('/auth/login', { email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchMe() {
    const { data } = await api_axios.get('/auth/me')
    user.value = data
  }
  return { token, user, isLoggedIn, login, logout, fetchMe }
})
