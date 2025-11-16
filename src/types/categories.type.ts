import type { CategoryKindSchema, CategorySchema, CreateCategorySchema } from "@/schema/category.schema";
import type z from "zod";

export type CategoryKind = z.infer<typeof CategoryKindSchema>;

export type CategoryType = z.infer<typeof CategorySchema>;

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
