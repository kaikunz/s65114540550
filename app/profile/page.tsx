import { auth } from "@/auth";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <section className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <p className="mb-3 text-5xl text-center font-semibold">
              โปรไฟล์ของคุณ
            </p>
            <div className="flex items-center gap-8">
              <div>
                <Image
                  src={user?.image ? user.image : "/images/default.png"}
                  alt={`profile photo of ${user?.name}`}
                  width={90}
                  height={90}
                />
              </div>
              <div className="mt-8">
                <p className="mb-3">ชื่อ: {user?.name}</p>
                <p className="mb-3">อีเมล: {user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
