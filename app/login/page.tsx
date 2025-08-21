import { LoginForm } from './login-form';
import Link from 'next/link';
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <>

      <section className='min-h-screen pt-20'>
        <div className='container mx-auto h-full flex justify-center items-center'>

          <div className='w-full lg:w-1/2 bg-white lg:p-8 p-2 border-gray-200 rounded-lg'>
              <p className="lg:text-3xl text-xl font-bold text-center m-4">เข้าสู่ระบบ</p>
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
              </Suspense>
              <p className="text-center font-bold text-gray-600 mt-5 text-lg">หากยังไม่ได้เป็นสมาชิก
                  <Link href="/register" className="text-red-600"> สมัครเลย </Link>
              </p>
          </div>
        </div>
      </section>
    </>
  );
}
