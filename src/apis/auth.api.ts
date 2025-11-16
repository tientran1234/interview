import http from "@/utils/https";


export const AUTH = {
    ME: "/users/me",
    LOGOUT: "/users/logout",
    REFRESH: "/users/refresh-token"
};

const authApi = {



    me() {
        return http.get<{
            result: {
                email: string,
                full_name: string,
                avatar_url: string
            }
        }>(AUTH.ME);
    },

    logout(refreshToken: string) {
        return http.post(AUTH.LOGOUT, {
            refresh_token: refreshToken
        });
    },


    refreshToken(refreshToken: string) {
        return http.post<{
            result: {
                access_token: string;
                refresh_token: string;
            };
        }>(AUTH.REFRESH, {
            refresh_token: refreshToken
        });
    }
};

export default authApi;
