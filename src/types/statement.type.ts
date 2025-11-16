import type { TransactionType } from "@/schema/transaction.schema";
import { ObjectId } from "mongodb";


export type StatementParams = {
    wallet_id: string;
    from_date: Date;
    to_date: Date;
};

export type StatementItem = TransactionType & {
    _id: ObjectId;
    opening_balance: number;
    closing_balance: number;
};

export type StatementResult = {
    wallet: {
        _id: ObjectId;
        name: string;
        current_balance: number | null;
    };
    period: {
        from_date: Date;
        to_date: Date;
    };
    opening_balance: number;
    total_income: number;
    total_expense: number;
    closing_balance: number;
    items: StatementItem[];
};