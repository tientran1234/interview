import { useState } from "react";
import { Button, Modal, InputNumber, Input, DatePicker, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import { useAppStore } from "@/contexts/app.context";

import { useGetWalletsQuery } from "@/hooks/useWallet";
import { useGetCategoriesQuery } from "@/hooks/useCategory";

import type { WalletType } from "@/types/wallets.type";
import type { CategoryType, CategoryKind } from "@/types/categories.type";
import { useCreateTransactionMutation } from "@/hooks/useTransaction";
import {
  CreateTransactionSchema,
  type CreateTransactionType,
} from "@/schema/transaction.schema";

const CreateTransactionButton = () => {
  const [open, setOpen] = useState(false);
  const createTransactionMutation = useCreateTransactionMutation();
  const addNotification = useAppStore.getState().addNotification;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateTransactionType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type: "expense",
      trans_date: new Date(),
    },
  });

  const watchType = watch("type");

  // Lấy danh sách ví (cho select ví)
  const { data: walletsRes } = useGetWalletsQuery({ page: 1, limit: 100 });
  const wallets: WalletType[] = walletsRes?.data.result.items || [];

  // Lấy danh sách category theo type (thu/chi)
  const { data: categoriesRes } = useGetCategoriesQuery({
    page: 1,
    limit: 100,
    type: watchType as CategoryKind | undefined,
  });
  console.log(categoriesRes?.data);

  const categories: CategoryType[] = categoriesRes?.data.result.items || [];

  const onSubmit = (data: CreateTransactionType) => {
    createTransactionMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            message: "Ghi chép giao dịch thành công!",
            duration: 3000,
          });
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        + Thêm giao dịch
      </Button>

      <Modal
        title="Thêm giao dịch Thu / Chi"
        open={open}
        onCancel={() => {
          setOpen(false);
          reset();
        }}
        okText="Lưu giao dịch"
        cancelText="Hủy"
        onOk={handleSubmit(onSubmit)}
        centered
        width={600}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* TYPE */}
          <div>
            <label>Loại giao dịch</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  options={[
                    { label: "Thu (Tiền vào)", value: "income" },
                    { label: "Chi (Tiền ra)", value: "expense" },
                  ]}
                />
              )}
            />
            {errors.type && (
              <p style={{ color: "red" }}>{errors.type.message}</p>
            )}
          </div>

          {/* WALLET */}
          <div>
            <label>Ví</label>
            <Controller
              name="wallet_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Chọn ví"
                  options={wallets.map((w) => ({
                    label: w.name,
                    value: w._id,
                  }))}
                />
              )}
            />
            {errors.wallet_id && (
              <p style={{ color: "red" }}>{errors.wallet_id.message}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label>Danh mục</label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Chọn danh mục"
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                />
              )}
            />
            {errors.category_id && (
              <p style={{ color: "red" }}>{errors.category_id.message}</p>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <label>Số tiền</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập số tiền"
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                />
              )}
            />
            {errors.amount && (
              <p style={{ color: "red" }}>{errors.amount.message}</p>
            )}
          </div>

          {/* DATE */}
          <div>
            <label>Ngày giao dịch</label>
            <Controller
              name="trans_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate() || null)}
                />
              )}
            />
            {errors.trans_date && (
              <p style={{ color: "red" }}>{errors.trans_date.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label>Ghi chú</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="Ví dụ: Lương tháng 10, Ăn trưa, Mua sắm..."
                />
              )}
            />
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description.message}</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateTransactionButton;
