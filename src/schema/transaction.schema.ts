import { z } from "zod";


export const TransactionKindEnum = z.enum(["income", "expense"]);
export type TransactionKind = z.infer<typeof TransactionKindEnum>;

export const CreateTransactionSchema = z.object({
    wallet_id: z.string().min(1, "Ví là bắt buộc"),
    category_id: z.string().min(1, "Danh mục là bắt buộc"),

    type: TransactionKindEnum,

    amount: z
        .number({
            error: "Số tiền phải là số",
        })
        .positive("Số tiền phải lớn hơn 0"),

    description: z
        .string()
        .optional(),

    trans_date: z
        .date({
            error: "Ngày giao dịch không hợp lệ",
        }),
});


export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>;

export interface TransactionType {
    _id?: string;
    user_id: string;
    wallet_id: string;
    category_id: string;

    type: TransactionKind;

    amount: number;
    description?: string;

    trans_date: Date;
    created_at?: Date;
}
export interface GetTransactionStatementQuery {
    wallet_id: string;
    from_date: string;
    to_date: string;
}

export interface GetTransactionStatement {
    wallet: {
        _id: string;
        name: string;
        start_balance: number;
        current_balance: number;
    };
    period: {
        from_date: string;
        to_date: string;
    };
    opening_balance: number;
    total_income: number;
    total_expense: number;
    closing_balance: number;
    items: TransactionType[];
}