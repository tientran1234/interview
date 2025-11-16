import { useState } from "react";
import { Button, Modal, Input, InputNumber } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWalletSchema } from "@/schema/wallet.schema";

import { useAppStore } from "@/contexts/app.context";
import { useCreateWalletMutation } from "@/hooks/useWallet";
import type { CreateWalletType } from "@/types/wallets.type";

const CreateWalletButton = () => {
  const [open, setOpen] = useState(false);
  const createWalletMutation = useCreateWalletMutation();
  const addNotification = useAppStore.getState().addNotification;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWalletType>({
    resolver: zodResolver(CreateWalletSchema),
  });
  const onSubmit = (data: CreateWalletType) => {
    createWalletMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            message: "Tạo ví thành công!",
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
        + Tạo ví
      </Button>

      <Modal
        title="Tạo ví mới"
        open={open}
        onCancel={() => {
          setOpen(false);
          reset();
        }}
        okText="Tạo ví"
        cancelText="Hủy"
        onOk={handleSubmit(onSubmit)}
        centered
        width={500}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label>Tên ví</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ví tiền mặt hoặc Vietcombank" />
              )}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label>Tên ngân hàng</label>
            <Controller
              name="bank_name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Vietcombank / Techcombank..." />
              )}
            />
            {errors.bank_name && (
              <p style={{ color: "red" }}>{errors.bank_name.message}</p>
            )}
          </div>

          <div>
            <label>Số tài khoản</label>
            <Controller
              name="account_number"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập STK" />
              )}
            />
            {errors.account_number && (
              <p style={{ color: "red" }}>{errors.account_number.message}</p>
            )}
          </div>

          <div>
            <label>Số dư ban đầu</label>
            <Controller
              name="balance"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                />
              )}
            />
            {errors.balance && (
              <p style={{ color: "red" }}>{errors.balance.message}</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateWalletButton;
