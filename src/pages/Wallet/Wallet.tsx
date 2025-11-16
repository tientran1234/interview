import React, { useState } from "react";
import CreateWalletButton from "./CreateWallet";
import { useGetWalletsQuery } from "@/hooks/useWallet";
import type { WalletType } from "@/types/wallets.type";

const Wallet: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetWalletsQuery({
    page,
    limit,
  });

  console.log(data?.data.result);

  const wallets: WalletType[] = data?.data.result.items || [];
  const pagination = data?.data?.result.pagination;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!pagination) return;
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  if (isLoading) return <div>Đang tải ví...</div>;
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
        <h2>Ví của tôi</h2>
        <CreateWalletButton />
      </div>

      {wallets.length === 0 ? (
        <p>Chưa có ví nào, hãy tạo ví mới.</p>
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
                    textAlign: "left",
                    padding: 8,
                  }}
                >
                  Tên ví
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: 8,
                  }}
                >
                  Ngân hàng
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: 8,
                  }}
                >
                  Số tài khoản
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "right",
                    padding: 8,
                  }}
                >
                  Số dư ban đầu
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: 8,
                  }}
                >
                  Ngày bắt đầu
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) => (
                <tr key={w._id}>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {w.name}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {w.bank_name || "-"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {w.account_number || "-"}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {w.balance.toLocaleString("vi-VN")}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>
                    {new Date(w.start_balance_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: 8,
                      textAlign: "center",
                    }}
                  >
                    {w.is_active ? "Đang dùng" : "Đã ẩn"}
                  </td>
                </tr>
              ))}
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
                <span> — Tổng: {pagination.total} ví</span>
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

export default Wallet;
