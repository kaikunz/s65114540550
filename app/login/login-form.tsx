'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { LoginUserInput, loginUserSchema } from '@/lib/user-schema';
import crypto from "crypto";

function hash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}


export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    try {
      setSubmitting(true);
      const hashed_password = await hash(values.password);

      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: hashed_password,
        redirectTo: callbackUrl,
      });

      setSubmitting(false);

      if (!res?.error) {
        toast.success('เข้าสู่ระบบสำเร็จ');
        router.push(callbackUrl);
      } else {
        reset({ password: '' });
        const message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        toast.error(message);
        setError(message);
      }
    } catch (error: any) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const input_style =
    'form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-red-700 focus:bg-white focus:border-red-600 focus:outline-none';

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {error && (
        <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
      )}
      <div className='mb-6'>
        <p className="text-gray-600 mb-3">อีเมล</p>
        <input
          type='email'
          {...register('email')}
          placeholder='อีเมลล์ของคุณ'
          className={`${input_style}`}
        />
        {errors['email'] && (
          <span className='text-red-500 text-xs pt-1 block mt-1'>
            {errors['email']?.message as string}
          </span>
        )}
      </div>
      <div className='mb-6'>
      <p className="text-gray-600 mb-3">รหัสผ่าน</p>
        <input
          type='password'
          {...register('password')}
          placeholder='รหัสผ่านของคุณ'
          className={`${input_style}`}
        />
        {errors['password'] && (
          <span className='text-red-500 text-xs pt-1 block mt-1'>
            {errors['password']?.message as string}
          </span>
        )}
      </div>
      <button
        type='submit'
        style={{ backgroundColor: `${submitting ? '#780614' : '#ea1d36'}`}}
        className='inline-block px-7 py-4 hover:text-black text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full'
        disabled={submitting}
      >
        {submitting ? 'เข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>

    </form>
  );
};
