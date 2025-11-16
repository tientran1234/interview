
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import walletApi from "@/apis/wallets.api";
import type { Pagination } from "@/types/utils.type";
import type { CreateWalletType } from "@/types/wallets.type";


export const useGetWalletsQuery = (
    query?: Pagination
) => {
    return useQuery({
        queryKey: ["wallets", query],
        queryFn: () => walletApi.getWallets(query),
    });
};


export const useCreateWalletMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateWalletType) => walletApi.createWallet(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
        },
    });
};

