import http from "@/utils/https";


export const AUTH = {
    ME: "/users/me",
    REFRESH_TOKEN: "/users/refresh-token",
    LOGOUT: "/users/logout",
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

};

export default authApi;
