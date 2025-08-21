"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { CreateUserInput, createUserSchema } from "@/lib/user-schema";

export const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorData.errors.forEach((error: any) => {
            toast.error(error.message);
          });

          return;
        }

        toast.error(errorData.message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-red-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-6">
        <p className="text-gray-600 mb-3">ชื่อ</p>
        <input
          {...register("name")}
          placeholder="ชื่อของคุณ"
          className={`${input_style}`}
        />
        {errors["name"] && (
          <span className="text-red-500 text-xs mt-1 pt-1 block">
            {errors["name"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <p className="text-gray-600 mb-3">อีเมล</p>
        <input
          type="email"
          {...register("email")}
          placeholder="อีเมลของคุณ"
          className={`${input_style}`}
        />
        {errors["email"] && (
          <span className="text-red-500 text-xs mt-1 pt-1 block">
            {errors["email"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <p className="text-gray-600 mb-3">รหัสผ่าน</p>
        <input
          type="password"
          {...register("password")}
          placeholder="รหัสผ่านของคุณ"
          className={`${input_style}`}
        />
        {errors["password"] && (
          <span className="text-red-500 text-xs mt-1 pt-1 block">
            {errors["password"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <p className="text-gray-600 mb-3">ยืนยันรหัสผ่าน</p>
        <input
          type="password"
          {...register("passwordConfirm")}
          placeholder="ยืนยันรหัสผ่านของคุณ"
          className={`${input_style}`}
        />
        {errors["passwordConfirm"] && (
          <span className="text-red-500 text-xs mt-1 pt-1 block">
            {errors["passwordConfirm"]?.message as string}
          </span>
        )}
      </div>
      <button
        type="submit"
        style={{ backgroundColor: `${submitting ? "#780614" : "#ea1d36"}` }}
        className="inline-block px-7 py-4 hover:text-black text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        disabled={submitting}
      >
        {submitting ? "สมัครสมาชิก..." : "สมัครสมาชิก"}
      </button>
    </form>
  );
};
