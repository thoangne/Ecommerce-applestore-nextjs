import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
// LoginSchema.parse({
//     email: "test@me.com",
//     password: "password",
// })

export const ProductSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().optional(),

  // ✅ SỬA LỖI: z.coerce.number() không chấp nhận tham số 'invalid_type_error'
  price: z.coerce.number().min(0, "Giá không thể âm"),

  // ✅ SỬA LỖI: Tương tự
  inventory: z.coerce
    .number()
    .int("Tồn kho phải là số nguyên")
    .min(0, "Tồn kho không thể âm"),

  // ✅ SỬA LỖI: Khớp với file seed.ts MỚI
  // ID phải là CUID (của danh mục con) hoặc chuỗi rỗng
  categoryId: z
    .string()
    .cuid("ID danh mục không hợp lệ") // Yêu cầu CUID
    .optional()
    .or(z.literal("")), // Hoặc là chuỗi rỗng

  // Thêm các trường mới từ schema của bạn
  color: z.string().optional(),
  storage: z.string().optional(),
  specs: z.string().optional(), // Sẽ được parse JSON ở action
  releasedAt: z.coerce.date().optional(), // Ép kiểu sang Date

  // 'images' sẽ được xử lý riêng (vì nó là 'File')
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
