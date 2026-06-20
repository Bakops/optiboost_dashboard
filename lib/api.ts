import {
  clearStoredSession,
  isBrowser,
  readStoredSession,
  writeStoredSession,
  type StoredAuthOrganization,
  type StoredAuthUser,
} from "@/lib/auth-session"

export type ClientStatus = "Fidèle" | "À relancer" | "Perdu"

export type DashboardOverview = {
  averageBasket: number
  averageBasketDelta: number
  premiumRatio: number
  segments: {
    fidele: number
    aRelancer: number
    perdu: number
  }
  recoveryPotential: number
  quickCampaignCounts: {
    email: number
    sms: number
    whatsapp: number
  }
}

export type RecentClient = {
  id: string
  name: string
  status: ClientStatus
  lastPurchase: string
}

export type CampaignSummary = {
  id: string
  name: string
  channel: string
  status: string
  sent: number
  delivered: number
  opened: number
  openRate: number
}

export type Campaign = {
  id: string
  name: string
  channel: "email" | "sms" | "whatsapp"
  status: "draft" | "scheduled" | "running" | "completed" | "paused" | "cancelled"
  segmentId: string
  messageTemplate: string
  scheduledAt: string | null
  sentAt: string | null
  createdByUserId: string
  createdAt: string
  updatedAt: string
}

export type CampaignAnalytics = {
  sent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  failed: number
  revenueGenerated: number
}

export type ClientsListItem = {
  id: string
  name: string
  email: string
  phone: string
  status: ClientStatus
  category: "Premium" | "Standard"
  lastPurchase: string
  lastPurchaseAt: string
  total: number
  source: string
}

export type ClientsListResponse = {
  data: ClientsListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type SimulatorDefaults = {
  inactiveClients: number
  averageBasket: number
  conversionRate: number
}

export type SimulatorEstimate = {
  recoveredClients: number
  estimatedRevenue: number
}

export type AuthResponse = {
  message: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    provider: string
  }
  organization?: {
    id: string
    name: string
    industry: string
  }
  tokens?: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export type CurrentSessionResponse = {
  user: StoredAuthUser
  organization: StoredAuthOrganization
}

export type ForgotPasswordResponse = {
  message: string
  email: string
}

export type ImportResponse = {
  message: string
  importId: string
  status: string
  fileName: string
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

export function getApiBaseUrls() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (configuredBaseUrl) {
    return [normalizeBaseUrl(configuredBaseUrl)]
  }

  return [
    normalizeBaseUrl("http://localhost:3000/api/v1"),
    normalizeBaseUrl("http://localhost:3002/api/v1"),
  ]
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await performApiFetch<T>(path, init)
  return response
}

async function performApiFetch<T>(
  path: string,
  init?: RequestInit,
  allowRefresh = true,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const storedSession = readStoredSession()

  if (storedSession?.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${storedSession.accessToken}`)
  }

  const baseUrls = getApiBaseUrls()
  let response: Response | null = null
  let lastError: Error | null = null

  for (const baseUrl of baseUrls) {
    try {
      const candidateResponse = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
        cache: init?.cache ?? "no-store",
      })

      if (candidateResponse.ok || candidateResponse.status !== 404) {
        response = candidateResponse
        break
      }

      response = candidateResponse
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("API unavailable")
    }
  }

  if (!response) {
    throw lastError ?? new Error("API unavailable")
  }

  if (response.status === 401 && allowRefresh && isBrowser()) {
    const refreshed = await refreshStoredSession()

    if (refreshed) {
      return performApiFetch<T>(path, init, false)
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody) {
  return apiFetch<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function apiPatch<TResponse, TBody>(path: string, body: TBody) {
  return apiFetch<TResponse>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function getDashboardOverview() {
  return apiFetch<DashboardOverview>("/dashboard/overview")
}

export async function getDashboardRecentClients() {
  return apiFetch<RecentClient[]>("/dashboard/recent-clients")
}

export async function getDashboardCampaignsSummary() {
  return apiFetch<CampaignSummary[]>("/dashboard/campaigns-summary")
}

export async function getClients(searchParams?: URLSearchParams) {
  const query = searchParams?.toString()
  return apiFetch<ClientsListResponse>(`/clients${query ? `?${query}` : ""}`)
}

export async function login(body: { email: string; password: string }) {
  return apiPost<AuthResponse, typeof body>("/auth/login", body)
}

export async function register(body: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  organizationName?: string
}) {
  return apiPost<AuthResponse, typeof body>("/auth/register", body)
}

export async function loginWithGoogle(body: { email?: string; idToken?: string }) {
  return apiPost<AuthResponse, typeof body>("/auth/google", body)
}

export async function forgotPassword(body: { email: string }) {
  return apiPost<ForgotPasswordResponse, typeof body>("/auth/forgot-password", body)
}

export async function refreshAuthSession(refreshToken: string) {
  return performApiFetch<AuthResponse>(
    "/auth/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    },
    false,
  )
}

export async function getCurrentSession() {
  return apiFetch<CurrentSessionResponse>("/auth/me")
}

export async function logoutCurrentSession() {
  const storedSession = readStoredSession()

  if (storedSession?.refreshToken) {
    try {
      await apiPost<{ message: string }, { refreshToken: string }>("/auth/logout", {
        refreshToken: storedSession.refreshToken,
      })
    } catch {
      // Ignore logout failures and clear the local session anyway.
    }
  }

  clearStoredSession()
}

export function persistAuthSession(response: AuthResponse) {
  if (!response.tokens) {
    return
  }

  writeStoredSession({
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    expiresAt: Date.now() + response.tokens.expiresIn * 1000,
    user: response.user,
    organization: response.organization,
  })
}

async function refreshStoredSession() {
  const storedSession = readStoredSession()

  if (!storedSession?.refreshToken) {
    clearStoredSession()
    return false
  }

  try {
    const refreshedSession = await refreshAuthSession(storedSession.refreshToken)
    persistAuthSession(refreshedSession)
    return true
  } catch {
    clearStoredSession()
    return false
  }
}

export async function relanceClient(
  clientId: string,
  body: { channel: "email" | "sms" | "whatsapp"; template?: string },
) {
  return apiPost<{ message: string }, typeof body>(`/clients/${clientId}/relance`, body)
}

export async function getCampaigns() {
  return apiFetch<Campaign[]>("/campaigns")
}

export async function launchCampaign(campaignId: string) {
  return apiPost<{ message: string; campaign: Campaign }, Record<string, never>>(
    `/campaigns/${campaignId}/launch`,
    {},
  )
}

export async function getCampaignAnalytics(campaignId: string) {
  return apiFetch<CampaignAnalytics>(`/campaigns/${campaignId}/analytics`)
}

export async function estimateSimulator(body: {
  inactiveClients: number
  averageBasket: number
  conversionRate: number
}) {
  return apiPost<SimulatorEstimate, typeof body>("/simulator/estimate", body)
}

export async function createImport(body: { fileName?: string; totalRows?: number }) {
  return apiPost<ImportResponse, typeof body>("/imports", body)
}

export async function getSimulatorDefaults() {
  return apiFetch<SimulatorDefaults>("/simulator/defaults")
}