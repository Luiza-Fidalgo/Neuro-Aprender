let csrfToken = null
let onUnauthorized = null

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

export function resetSession() {
  csrfToken = null
}

export async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch('/api' + path, {
      method,
      credentials: 'same-origin',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(method !== 'GET' && csrfToken ? { 'X-CSRF-Token': csrfToken } : {})
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.')
  }
  const result = await response.json().catch(() => ({}))
  if (response.status === 401 && path !== '/login') {
    resetSession()
    onUnauthorized?.()
    throw new Error('Sua sessão expirou. Entre novamente.')
  }
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a operação.')
  if (typeof result.csrfToken === 'string') csrfToken = result.csrfToken
  return result
}

export const getSession = () => request('/session')
export const login = (username, password) => request('/login', { method: 'POST', body: { username, password } })
export const logout = () => request('/logout', { method: 'POST' })
export const listProfiles = () => request('/profiles')
export const createProfile = code => request('/profiles', { method: 'POST', body: { code } })
export const deleteProfile = id => request('/profiles/' + encodeURIComponent(id), { method: 'DELETE' })
export const listRecords = profileId => request('/records?profile_id=' + encodeURIComponent(profileId))
export const createRecord = item => request('/records', { method: 'POST', body: item })
export const deleteRecord = id => request('/records/' + encodeURIComponent(id), { method: 'DELETE' })
