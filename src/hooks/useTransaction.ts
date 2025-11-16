import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import transactionApi from "@/apis/transactions.api";
import type { Pagination } from "@/types/utils.type";
import type {
    TransactionKind,
    CreateTransactionType,
    GetTransactionStatementQuery,

} from "@/schema/transaction.schema";

export const useGetTransactionsQuery = (
    query?: Pagination & {
        type?: TransactionKind;
        wallet_id?: string;
        from_date?: string;
        to_date?: string;
    }
) => {
    return useQuery({
        queryKey: ["transactions", query],
        queryFn: () => transactionApi.getTransactions(query),
    });
};
export const useGetTransactionStatement = (
    query: GetTransactionStatementQuery
        & { enabled: boolean }

) => {
    return useQuery({
        queryKey: ["transaction-statement", query],
        queryFn: () => transactionApi.getStatement(query),
        enabled: !!query.wallet_id && !!query.from_date && !!query.to_date && !!query.enabled,

    });
};

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateTransactionType) =>
            transactionApi.createTransaction(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
};

