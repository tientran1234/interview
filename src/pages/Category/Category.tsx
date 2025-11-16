import React, { useState } from "react";
import CreateCategoryButton from "./CreateCategory";
import { useGetCategoriesQuery } from "@/hooks/useCategory";
import type { CategoryType } from "@/types/categories.type";

const Category: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetCategoriesQuery({
    page,
    limit,
  });

  const categories: CategoryType[] = data?.data.result.items || [];
  const pagination = data?.data.result.pagination;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!pagination) return;
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  if (isLoading) return <div>Đang tải danh mục...</div>;
  if (isError)
    return (
      <div>
        Có lỗi xảy ra
        <button onClick={() => refetch()}>Thử lại</button>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Danh mục thu / chi</h2>
        <CreateCategoryButton />
      </div>

      {categories.length === 0 ? (
        <p>Chưa có danh mục nào, hãy tạo danh mục mới.</p>
      ) : (
        <>
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Tên danh mục
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Loại
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Mặc định
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {c.name}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {c.type === "income" ? "Thu nhập" : "Chi tiêu"}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: 8,
                      textAlign: "center",
                    }}
                  >
                    {c.is_default ? "Đúng" : "-"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <div>
              Trang {pagination?.page} / {pagination?.totalPages}
              {typeof pagination?.total === "number" && (
                <span> — Tổng: {pagination.total} danh mục</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handlePrev} disabled={page === 1}>
                Trang trước
              </button>
              <button
                onClick={handleNext}
                disabled={!pagination || page === pagination.totalPages}
              >
                Trang sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
