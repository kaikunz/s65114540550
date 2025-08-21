import { TypeOf, object, string } from "zod";

export const createUserSchema = object({
  name: string({ required_error: "Name is required" }).min(
    1,
    "ชื่อจำเป็นต้องกรอกนะคะ"
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "อีเมลล์จำเป็นต้องกรอกนะคะ")
    .email("อีเมลล์ไม่ถูกต้อง"),
  photo: string().optional(),
  password: string({ required_error: "Password is required" })
    .min(1, "รหัสผ่านจำเป็นต้องกรอกนะคะ")
    .min(8, "รหัสผ่านควรมีมากกว่า 8 ตัวนะคะ")
    .max(32, "รหัสผ่านควรมีไม่เกิน 32 ตัวนะคะ"),
  passwordConfirm: string({
    required_error: "Please confirm your password",
  }).min(1, "กรุณายืนยันรหัสผ่านของคุณ"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "รหัสผ่านไม่ตรงกัน",
});

export const loginUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "อีเมลล์จำเป็นต้องกรอกนะคะ")
    .email("อีเมลไม่ถูกต้อง"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "รหัสผ่านจำเป็นต้องกรอกนะคะ"
  ),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
