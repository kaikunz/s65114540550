"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from 'next/navigation'

export default function EditProfileForm({ user }: { user: any }) {
  const [name, Setname] = useState(user?.name || "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.image || "/images/default.png"); 
  const router = useRouter();

  const UpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(); 
    formData.append("name", name);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await axios.post("/api/updateprofile", formData);
      if (response.status === 200) {
        toast.success("อัปเดตข้อมูลโปรไฟล์สำเร็จ");
      } else {
        toast.error("ผิดพลาด?");
      }
    } catch (error) {
      toast.error("ไม่สามารถยิง API ได้???");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setThumbnail(file); 
    if (file) {
      const objectURL = URL.createObjectURL(file); 
      setPreviewUrl(objectURL);
    } else {
      setPreviewUrl("/images/default.png");
    }
  };

  return (
    <>
      <form className="lg:w-1/2 w-full mx-auto mt-6" id="formedituser" onSubmit={UpdateProfile}>
        <div className="flex items-center mb-6">
          <div className="shrink-0 mr-[16px] my-4">
            <img
              className="mx-auto md:size-32 size-16 shrink-0 rounded-md"
              src={previewUrl}
              alt="Preview"
              id="previewimg"
            />
          </div>
          <div className="flex flex-col grow min-w-0 mt-2 mb-3">
            <label
              htmlFor="uploadprofile"
              className="bg-red-600 text-white hover:bg-red-500 rounded-lg md:p-2 p-1 font-bold w-32 mt-2 text-center"
            >
              เปลี่ยนรูป
              <input
                type="file"
                id="uploadprofile"
                onChange={handleFileChange}
                accept="image/png, image/gif, image/jpeg, image/jpg"
                className="hidden"
              />
            </label>
            <p className="font-bold text-sm text-gray-500 mt-4">
              JPG, PNG, JPEG ไม่เกิน 1MB
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-3">ชื่อของคุณ</p>
        <input
          type="text"
          placeholder="ชื่อฉายาของคุณ"
          value={name}
          onChange={(e) => Setname(e.target.value)}
          required
          className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />

        <button
          type="submit"
          className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        >
          บันทึก
        </button>
      </form>
    </>
  );
}
