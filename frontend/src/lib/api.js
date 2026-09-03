import { API_URL } from '../config'

async function request(path, { method = 'GET', body, formData, signal } = {}) {
  const options = { method, signal, credentials: 'include', headers: {} }
  if (formData) options.body = formData
  else if (body !== undefined) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body) }
  let response
  try { response = await fetch(`${API_URL}${path}`, options) } catch { throw new Error("We couldn't reach the server. Please check your connection and try again.") }
  let data = null
  try { data = await response.json() } catch {}
  if (!response.ok) { const message = data?.message || (response.status === 429 ? 'That was a few too many attempts. Please wait a moment and try again.' : response.status >= 500 ? 'Something went wrong on our side. Please try again in a moment.' : 'Something went wrong. Please try again.'); const error = new Error(message); error.status = response.status; error.fields = data?.errors; throw error }
  return data
}

export const api = {
  health: () => request('/api/health'),
  createOrder: ({ items, customer, delivery, contactMethod, notes }) => { const formData = new FormData(); items.forEach((item, index) => item.screenshots?.forEach(file => formData.append(`items[${index}][screenshots]`, file, file.name))); formData.append('payload', JSON.stringify({ items, customer, delivery, contactMethod, notes })); return request('/api/orders', { method: 'POST', formData }) },
  trackOrder: (reference, phone) => request(`/api/orders/track?reference=${encodeURIComponent(reference.trim())}&phone=${encodeURIComponent(phone.trim())}`),
  adminLogin: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST' }),
  adminMe: () => request('/api/admin/me'),
  adminSecurity: () => request('/api/admin/security'),
  adminChangePassword: (currentPassword, newPassword) => request('/api/admin/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
  adminRequestPasswordReset: (email) => request('/api/admin/request-reset', { method: 'POST', body: { email } }),
  adminResetPassword: (token, newPassword) => request('/api/admin/reset-password', { method: 'POST', body: { token, newPassword } }),
  adminOrders: ({ search = '', status = '', paymentStatus = '', page = 1 } = {}) => { const params = new URLSearchParams(); if (search) params.set('search', search); if (status) params.set('status', status); if (paymentStatus) params.set('paymentStatus', paymentStatus); params.set('page', String(page)); return request(`/api/admin/orders?${params.toString()}`) },
  adminOrder: id => request(`/api/admin/orders/${encodeURIComponent(id)}`),
  adminUpdateOrder: (id, patch) => request(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }),
}
