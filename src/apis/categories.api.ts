
import type { CategoryKind, CategoryType, CreateCategoryType } from "@/types/categories.type";
import type { Pagination } from "@/types/utils.type";

import http from "@/utils/https";
import { buildQueryURL } from "@/utils/utils";

export const CATEGORIES = "/categories";

const categoryApi = {

    createCategory(body: CreateCategoryType) {
        return http.post(CATEGORIES, body);
    },


    getCategories(
        query?: Pagination & {
            type?: CategoryKind;
            isReport?: boolean
        }
    ) {
        return http.get<{
            result: {
                items: CategoryType[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            };
        }>(buildQueryURL(CATEGORIES, query));
    }
};

export default categoryApi;
