import React, { useMemo, useState } from "react";
import CreateTransactionButton from "./CreateTransaction";
import { useGetTransactionsQuery } from "@/hooks/useTransaction";
import { useGetWalletsQuery } from "@/hooks/useWallet";
import { useGetCategoriesQuery } from "@/hooks/useCategory";

import type { WalletType } from "@/types/wallets.type";
import type { CategoryType, CategoryKind } from "@/types/categories.type";
import type { TransactionType } from "@/schema/transaction.schema";

const Transaction: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filterType, setFilterType] = useState<CategoryKind | "all">("all");

  const { data, isLoading, isError, refetch } = useGetTransactionsQuery({
    page,
    limit,
    type: filterType === "all" ? undefined : filterType,
  });

  const transactions: TransactionType[] = data?.data.result.items || [];
  const pagination = data?.data.result.pagination;

  const { data: walletsRes } = useGetWalletsQuery({ page: 1, limit: 100 });
  const wallets: WalletType[] = walletsRes?.data.result.items || [];

  const { data: categoriesRes } = useGetCategoriesQuery({
    page: 1,
    limit: 100,
    isReport: true,
  });
  const categories: CategoryType[] = categoriesRes?.data.result.items || [];

  const walletMap = useMemo(
    () =>
      wallets.reduce<Record<string, string>>((acc, w) => {
        if (w._id) acc[w._id] = w.name;
        return acc;
      }, {}),
    [wallets]
  );

  const categoryMap = useMemo(
    () =>
      categories.reduce<Record<string, { name: string; type: CategoryKind }>>(
        (acc, c) => {
          if (c._id) acc[c._id] = { name: c.name, type: c.type };
          return acc;
        },
        {}
      ),
    [categories]
  );

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!pagination) return;
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  if (isLoading) return <div>Đang tải giao dịch...</div>;
  if (isError)
    return (
      <div>
        Có lỗi xảy ra
        <button onClick={() => refetch()}>Thử lại</button>
      </div>
    );

  return (
    <div>
      {/* Header + button tạo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Giao dịch Thu / Chi</h2>
        <CreateTransactionButton />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Lọc theo loại: </label>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value as CategoryKind | "all");
            setPage(1);
          }}
        >
          <option value="all">Tất cả</option>
          <option value="income">Thu</option>
          <option value="expense">Chi</option>
        </select>
      </div>

      {transactions.length === 0 ? (
        <p>Chưa có giao dịch nào, hãy tạo giao dịch mới.</p>
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
                  Ngày
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Ví
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Danh mục
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
                    textAlign: "right",
                    padding: 8,
                  }}
                >
                  Số tiền
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const walletName = t.wallet_id
                  ? walletMap[String(t.wallet_id)]
                  : "-";
                const categoryInfo = t.category_id
                  ? categoryMap[String(t.category_id)]
                  : undefined;

                return (
                  <tr key={String(t._id)}>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "center",
                      }}
                    >
                      {new Date(t.trans_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "center",
                      }}
                    >
                      {walletName || "-"}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "center",
                      }}
                    >
                      {categoryInfo?.name || "-"}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "center",
                      }}
                    >
                      {t.type === "income" ? "Thu" : "Chi"}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "right",
                      }}
                    >
                      {t.amount.toLocaleString("vi-VN")}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: 8,
                        textAlign: "center",
                      }}
                    >
                      {t.description || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
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
                <span> — Tổng: {pagination.total} giao dịch</span>
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

export default Transaction;
