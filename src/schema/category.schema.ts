import { z } from "zod";

export const CategoryKindSchema = z.enum(["income", "expense"]);


export const CategorySchema = z.object({
    _id: z.string().optional(),
    type: CategoryKindSchema,
    name: z
        .string()
        .min(1, "Tên danh mục là bắt buộc")
        .max(255, "Tên danh mục không được quá 255 ký tự"),
    is_default: z.boolean().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
});


export const CreateCategorySchema = CategorySchema.pick({
    name: true,
    type: true,
});


