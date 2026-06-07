import { create } from 'zustand'
import axios from 'axios'

interface Event {
  _id: string
  title: string
  description: string
  category: string
  image: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  ticketPrice: number
  creator: any
}

interface EventStore {
  events: Event[]
  event: Event | null
  isLoading: boolean
  getEvents: (page?: number, filters?: any) => Promise<void>
  getEventById: (id: string) => Promise<void>
  createEvent: (data: any) => Promise<void>
  updateEvent: (id: string, data: any) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  getMyEvents: (page?: number) => Promise<void>
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  event: null,
  isLoading: false,

  getEvents: async (page = 1, filters = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await axios.get('/api/events', {
        params: { page, limit: 10, ...filters },
      })
      set({ events: data.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      console.error('Failed to fetch events')
    }
  },

  getEventById: async (id: string) => {
    set({ isLoading: true })
    try {
      const { data } = await axios.get(`/api/events/${id}`)
      set({ event: data.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  createEvent: async (formData: any) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/events', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      throw error.response?.data?.message || 'Failed to create event'
    }
  },

  updateEvent: async (id: string, data: any) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const { data: response } = await axios.put(`/api/events/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ event: response.data, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      throw error.response?.data?.message || 'Failed to update event'
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      throw error.response?.data?.message || 'Failed to delete event'
    }
  },

  getMyEvents: async (page = 1) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/events/my-events', {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ events: data.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },
}))