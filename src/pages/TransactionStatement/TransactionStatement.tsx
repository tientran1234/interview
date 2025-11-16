import React, { useMemo, useState } from "react";

import { useGetWalletsQuery } from "@/hooks/useWallet";
import { useGetCategoriesQuery } from "@/hooks/useCategory";
import { useGetTransactionStatement } from "@/hooks/useTransaction";

import type { WalletType } from "@/types/wallets.type";
import type { CategoryType, CategoryKind } from "@/types/categories.type";
import type { GetTransactionStatement } from "@/schema/transaction.schema";

const TransactionStatement: React.FC = () => {
  const [walletId, setWalletId] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: walletsRes } = useGetWalletsQuery({ page: 1, limit: 100 });
  const wallets: WalletType[] = walletsRes?.data.result.items || [];

  const { data: categoriesRes } = useGetCategoriesQuery({
    page: 1,
    limit: 100,
    isReport: true,
  });

  const categories: CategoryType[] = categoriesRes?.data.result.items || [];

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

  const { data, isLoading, isError, refetch, isFetching } =
    useGetTransactionStatement({
      wallet_id: walletId,
      from_date: fromDate,
      to_date: toDate,
      enabled: false,
    });

  const statement: GetTransactionStatement | undefined = data?.data.data;

  const handleViewStatement = () => {
    if (!walletId || !fromDate || !toDate) return;
    refetch();
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Sao kê giao dịch</h2>

      {/* Bộ lọc */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <label>Ví: </label>
          <select
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
          >
            <option value="">-- Chọn ví --</option>
            {wallets.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Từ ngày: </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>Đến ngày: </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button onClick={handleViewStatement} disabled={isFetching}>
          {isFetching ? "Đang tải..." : "Xem sao kê"}
        </button>
      </div>

      {/* Loading */}
      {isLoading && <div>Đang tải sao kê...</div>}

      {/* Error */}
      {isError && (
        <div>
          Có lỗi xảy ra. <button onClick={() => refetch()}>Thử lại</button>
        </div>
      )}

      {/* Chưa xem sao kê */}
      {!statement && !isLoading && !isError && (
        <p>Vui lòng chọn ví và khoảng thời gian để xem sao kê.</p>
      )}

      {/* Dữ liệu sao kê */}
      {statement && (
        <>
          {/* Thông tin ví + thời gian */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            <div>
              <strong>Ví:</strong> {statement.wallet.name}
            </div>

            <div>
              <strong>Khoảng thời gian:</strong>{" "}
              {new Date(statement.period.from_date).toLocaleDateString("vi-VN")}{" "}
              – {new Date(statement.period.to_date).toLocaleDateString("vi-VN")}
            </div>

            <div>
              <strong>Số dư hiện tại:</strong>{" "}
              {statement.wallet.current_balance.toLocaleString("vi-VN")}
            </div>
          </div>

          {/* Tổng hợp số liệu */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <strong>Số dư đầu kỳ:</strong>{" "}
              {statement.opening_balance.toLocaleString("vi-VN")}
            </div>
            <div>
              <strong>Tổng thu:</strong>{" "}
              {statement.total_income.toLocaleString("vi-VN")}
            </div>
            <div>
              <strong>Tổng chi:</strong>{" "}
              {statement.total_expense.toLocaleString("vi-VN")}
            </div>
            <div>
              <strong>Số dư cuối kỳ:</strong>{" "}
              {statement.closing_balance.toLocaleString("vi-VN")}
            </div>
          </div>

          {/* Bảng giao dịch */}
          {statement.items.length === 0 ? (
            <p>Không có giao dịch nào trong khoảng thời gian này.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Ngày</th>
                  <th style={thStyle}>Danh mục</th>
                  <th style={thStyle}>Loại</th>
                  <th style={thStyleRight}>Số tiền</th>
                  <th style={thStyle}>Ghi chú</th>
                </tr>
              </thead>

              <tbody>
                {statement.items.map((t) => {
                  const categoryInfo = t.category_id
                    ? categoryMap[String(t.category_id)]
                    : undefined;

                  return (
                    <tr key={String(t._id)}>
                      <td style={tdStyleCenter}>
                        {new Date(t.trans_date).toLocaleDateString("vi-VN")}
                      </td>

                      <td style={tdStyleCenter}>{categoryInfo?.name || "-"}</td>

                      <td style={tdStyleCenter}>
                        {t.type === "income" ? "Thu" : "Chi"}
                      </td>

                      <td style={tdStyleRight}>
                        {t.amount.toLocaleString("vi-VN")}
                      </td>

                      <td style={tdStyleCenter}>{t.description || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

/* Styles */
const thStyle = {
  borderBottom: "1px solid #ddd",
  textAlign: "center" as const,
  padding: 8,
};

const thStyleRight = {
  ...thStyle,
  textAlign: "right" as const,
};

const tdStyleCenter = {
  borderBottom: "1px solid #f0f0f0",
  padding: 8,
  textAlign: "center" as const,
};

const tdStyleRight = {
  borderBottom: "1px solid #f0f0f0",
  padding: 8,
  textAlign: "right" as const,
};

export default TransactionStatement;
