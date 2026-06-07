import { create } from 'zustand'
import axios from 'axios'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'creator' | 'eventee' | 'admin'
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  getProfile: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
    isLoading: false,

    login: async (email: string, password: string) => {
      set({ isLoading: true })
      try {
        const { data } = await axios.post('/api/auth/login', { email, password })
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        set({ user: data.data.user, token: data.data.token, isLoading: false })
      } catch (error: any) {
        set({ isLoading: false })
        throw error.response?.data?.message || 'Login failed'
      }
    },

    register: async (formData: any) => {
      set({ isLoading: true })
      try {
        const { data } = await axios.post('/api/auth/register', formData)
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        set({ user: data.data.user, token: data.data.token, isLoading: false })
      } catch (error: any) {
        set({ isLoading: false })
        throw error.response?.data?.message || 'Registration failed'
      }
    },

    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ user: null, token: null })
    },

    getProfile: async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        set({ user: data.data })
      } catch (error) {
        console.error('Failed to fetch profile')
      }
    },
  }
})