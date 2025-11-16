

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  const clearLSEvent = new Event('clearLS')

  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''


export const getOauthGoogleUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } = import.meta.env
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: VITE_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    )
  }
  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}
export const getLinkedinUrl = () => {
  const { VITE_LINKEDIN_CLIENT_ID, VITE_LINKEDIN_AUTHORIZED_REDIRECT_URI } = import.meta.env
  const rootUrl = 'https://www.linkedin.com/oauth/v2/authorization'
  const options = {
    response_type: 'code',
    state: '987654321',
    scope: ['openid', 'profile', 'email'].join(' '),
    client_id: VITE_LINKEDIN_CLIENT_ID,
    redirect_uri: VITE_LINKEDIN_AUTHORIZED_REDIRECT_URI
  }
  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}
