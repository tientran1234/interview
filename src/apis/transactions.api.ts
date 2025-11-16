
import type { CreateTransactionType, GetTransactionStatementQuery, TransactionKind, TransactionType } from "@/schema/transaction.schema";
import type { StatementResult } from "@/types/statement.type";
import type { Pagination } from "@/types/utils.type";

import http from "@/utils/https";
import { buildQueryURL } from "@/utils/utils";

export const TRANSACTIONS = "/transactions";

const transactionApi = {

    createTransaction(body: CreateTransactionType) {
        return http.post(TRANSACTIONS, body);
    },


    getTransactions(
        query?: Pagination & {
            type?: TransactionKind;
            wallet_id?: string;
            from_date?: string;
            to_date?: string;
        }
    ) {
        return http.get<{
            result: {
                items: TransactionType[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            };
        }>(buildQueryURL(TRANSACTIONS, query));
    },
    getStatement(query: GetTransactionStatementQuery) {
        return http.get<{
            data: StatementResult
        }>
            (buildQueryURL(`${TRANSACTIONS}/statement`, query));
    }

};

export default transactionApi;
