
export const PUBLIC_ROUTES = {
    login: "/login",
    logout: "/logout",
    home: "/",
    oauthGoogleCallback: "/oauth-google-callback",
    notFound: "/not-found"
} as const;

export const PRIVATE_ROUTES = {
    refreshToken: "refresh-token",
    dashboard: "/",
    wallets: "/wallets",
    walletDetail: "/wallets/:id",
    transactions: "/transactions",
    categories: "/categories",
    report: "/report",
    settings: "/settings",
} as const;

export const APP_ROUTES = {
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
} as const;
