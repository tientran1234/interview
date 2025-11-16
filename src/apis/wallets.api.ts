import type { Pagination } from "@/types/utils.type";
import type { CreateWalletType, WalletType } from "@/types/wallets.type";
import http from "@/utils/https";
import { buildQueryURL } from "@/utils/utils";

export const WALLETS = "/wallets";

const walletApi = {

    createWallet(body: CreateWalletType) {
        return http.post(WALLETS, body);
    },


    getWallets(query?: Pagination) {
        return http.get<{
            result: {
                items: WalletType[]
                pagination: {
                    page: number
                    limit: number
                    total: number
                    totalPages: number
                }
            }
        }>(buildQueryURL(WALLETS, query));
    },

};

export default walletApi;
