import { useState } from "react";
import { Button, Modal, Input, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/contexts/app.context";
import { useCreateCategoryMutation } from "@/hooks/useCategory";
import { CreateCategorySchema } from "@/schema/category.schema";
import type { CreateCategoryType } from "@/types/categories.type";

const CreateCategoryButton = () => {
  const [open, setOpen] = useState(false);
  const createCategoryMutation = useCreateCategoryMutation();
  const addNotification = useAppStore.getState().addNotification;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const onSubmit = (data: CreateCategoryType) => {
    createCategoryMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            message: "Tạo danh mục thành công!",
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
        + Tạo danh mục
      </Button>

      <Modal
        title="Tạo danh mục mới"
        open={open}
        onCancel={() => {
          setOpen(false);
          reset();
        }}
        okText="Tạo danh mục"
        cancelText="Hủy"
        onOk={handleSubmit(onSubmit)}
        centered
        width={500}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label>Tên danh mục</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ăn uống, Lương, Mua sắm..." />
              )}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label>Loại danh mục</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Chọn loại"
                  options={[
                    { label: "Thu nhập", value: "income" },
                    { label: "Chi tiêu", value: "expense" },
                  ]}
                />
              )}
            />
            {errors.type && (
              <p style={{ color: "red" }}>{errors.type.message}</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateCategoryButton;
