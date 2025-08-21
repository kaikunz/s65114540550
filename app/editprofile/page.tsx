import EditProfileForm from './edit-form';
import { auth } from "@/auth";

export default async function EditProfilePage() {
    const session = await auth(); 
    const user = session?.user;
  

  return (
    <>
        <div className="w-full p-3">
            <EditProfileForm user={user} />
        </div>
    </>
  );
}