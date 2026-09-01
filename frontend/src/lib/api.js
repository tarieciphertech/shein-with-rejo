import { API_URL } from '../config'

/**
 * Small typed-feeling API client for the SHEIN with Rejo backend.
 * All requests fail gracefully — callers receive an Error whose message is
 * safe to show to customers (the backend sends customer-friendly messages).
 */

async function request(path, { method = 'GET', body, formData, signal } = {}) {
  const options = {
    method,
    signal,
    credentials: 'include',
    headers: {},
  }

  if (formData) {
    options.body = formData
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.")
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Non-JSON response (e.g. proxy error page)
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (response.status === 429
        ? 'That was a few too many attempts. Please wait a moment and try again.'
        : response.status >= 500
          ? 'Something went wrong on our side. Please try again in a moment.'
          : 'Something went wrong. Please try again.')
    const error = new Error(message)
    error.status = response.status
    error.fields = data && data.errors ? data.errors : undefined
    throw error
  }

  return data
}

export const api = {
  health: () => request('/api/health'),

  createOrder: ({ items, customer, delivery, contactMethod, notes }) => {
    const formData = new FormData()
    items.forEach((item, index) => {
      if (item.screenshots && item.screenshots.length) {
        item.screenshots.forEach((file) => {
          formData.append(`items[${index}][screenshots]`, file, file.name)
        })
      }
    })
    const payload = { items, customer, delivery, contactMethod, notes }
    formData.append('payload', JSON.stringify(payload))
    return request('/api/orders', { method: 'POST', formData })
  },

  trackOrder: (reference, phone) =>
    request(`/api/orders/track?reference=${encodeURIComponent(reference.trim())}&phone=${encodeURIComponent(phone.trim())}`),

  // --- Admin (auth via httpOnly cookie) ---
  adminLogin: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminOrders: ({ search = '', status = '', paymentStatus = '', page = 1 } = {}) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (paymentStatus) params.set('paymentStatus', paymentStatus)
    params.set('page', String(page))
    return request(`/api/admin/orders?${params.toString()}`)
  },
  adminOrder: (id) => request(`/api/admin/orders/${encodeURIComponent(id)}`),
  adminUpdateOrder: (id, patch) => request(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }),
}
