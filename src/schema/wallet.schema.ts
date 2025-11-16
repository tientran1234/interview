import { z } from "zod";

export const CreateWalletSchema = z
    .object({
        name: z
            .string()
            .min(1, "Tên ví không được bỏ trống")
            .max(100, "Tên ví quá dài"),

        bank_name: z.string().optional().or(z.literal("")),
        account_number: z.string().optional().or(z.literal("")),

        balance: z
            .number({
                error: "Số dư ban đầu phải là số"
            })
            .min(0, "Số dư ban đầu phải ≥ 0"),
    }).superRefine(({ account_number, bank_name }, ctx) => {
        const hasBank = !!bank_name?.trim();
        const hasAccount = !!account_number?.trim();
        if (hasBank !== hasAccount) {
            ctx.addIssue({
                code: 'custom',
                message: "Nếu nhập tên ngân hàng thì phải nhập số tài khoản (và ngược lại)",
                path: ['account_number']
            })
        }
    })


