const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message || 'Não foi possível concluir a requisição.')
  }

  return body
}

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}
