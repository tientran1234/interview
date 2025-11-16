import authApi from "@/apis/auth.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMeQuery = (
) => {
    return useQuery({
        queryKey: ["me"],
        queryFn: () => authApi.me(),
    });
};


export const useLogoutMutation = (
) => {
    return useMutation({
        mutationFn: authApi.logout,
    });
};
