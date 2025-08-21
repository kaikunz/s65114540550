"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
}

export default function LiveCreate({ user }: DetailProps) {
  type Live = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    path: string;
    view_count: number;
    createdAt: string;
    updatedAt: string;
    OwnerUserID: string;
  };
  const [title, setTitle] = useState<string | null>(null);
  const [description, setdescription] = useState<string | null>(null);
  const [Thumbnail, setThumbnail] = useState<File | null>(null);
  const router = useRouter();

  
  

  const CreateLive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDatas = new FormData();
    if (Thumbnail) formDatas.append("thumbnail", Thumbnail);

    formDatas.append("title", title || "Untitled");
    formDatas.append("description", description || "");
  
    try {
      const res = await axios.post("/api/create-live", formDatas, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      

      if (res.status === 200) {
        const slug = res.data.Live.slug;

        if (!slug) {
          console.error('slug is undefined');
          return;
        }
        router.push(`/live-detail/${slug}`)
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    
  }

    return(
        <>
        
        <p className="text-3xl font-bold">สร้างกิจกรรม</p>

        <form className="lg:w-1/2 w-full mx-auto mt-6" id="formvideo" onSubmit={CreateLive}>
        <p className="text-gray-600 mb-3">ชื่อสตรีมสด</p>
          <input
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          />
          <p className="text-gray-600 mb-3">คำอธิบายสตรีม</p>
          <textarea
              placeholder="Description"
              onChange={(e) => setdescription(e.target.value)}
              required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          />
          <p className="text-gray-600 mb-3">ภาพปกสตรีม</p>

          <label className="block">
            <input
              type="file" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-red-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-red-50 file:text-red-700
            hover:file:bg-red-100
          " required/>
          </label>
         
          

          <button type="submit" className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full">สร้างสตรีม</button>

        </form>

        
        </>
    )

}