import { RegisterForm } from './register-form';

export default async function RegisterPage() {
  return (
    <>

      <section className='min-h-screen pt-20'>
              <div className='container mx-auto h-full flex justify-center items-center'>
      
                <div className='w-full lg:w-1/2 bg-white lg:p-8 p-2 border-gray-200 rounded-lg'>
                    <p className="lg:text-3xl text-xl font-bold text-center m-4">สมัครสมาชิก</p>
                    <RegisterForm />
                    
                </div>
              </div>
            </section>
    </>
  );
}
