import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://crowd-backend-real.onrender.com/'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export function getDashboard() {
  return api.get('/dashboard')
}

export function getAlerts() {
  return api.get('/alerts')
}

export function getAnalytics() {
  return api.get('/analytics')
}

export function getHeatmap() {
  return api.get('/heatmap')
}

export function postChatbot(message) {
  return api.post('/chatbot', { message })
}

export default api

