export type StoredAuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  provider: string
}

export type StoredAuthOrganization = {
  id: string
  name: string
  industry: string
}

export type StoredAuthSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user?: StoredAuthUser
  organization?: StoredAuthOrganization
}

const AUTH_STORAGE_KEY = "optiboost.auth.session"

export function isBrowser() {
  return typeof window !== "undefined"
}

export function readStoredSession(): StoredAuthSession | null {
  if (!isBrowser()) {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as StoredAuthSession
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function writeStoredSession(session: StoredAuthSession) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}