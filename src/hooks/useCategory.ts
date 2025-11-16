import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import categoryApi from "@/apis/categories.api";
import type { Pagination } from "@/types/utils.type";
import type { CategoryKind, CreateCategoryType } from "@/types/categories.type";

export const useGetCategoriesQuery = (
    query?: Pagination & {
        type?: CategoryKind;
        isReport?: boolean
    }
) => {
    return useQuery({
        queryKey: ["categories", query],
        queryFn: () => categoryApi.getCategories(query),
    });
};

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateCategoryType) => categoryApi.createCategory(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};




