import type { CreateWalletSchema } from "@/schema/wallet.schema";
import type z from "zod";
export interface WalletType {
    _id?: string
    user_id: string
    name: string
    bank_name?: string
    account_number?: string
    balance: number
    start_balance_date: Date
    is_active?: boolean
    created_at?: Date
    updated_at?: Date
}

export type CreateWalletType = z.infer<typeof CreateWalletSchema>;
