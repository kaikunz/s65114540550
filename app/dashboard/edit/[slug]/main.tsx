"use client";

import axios from "axios";
import {useRef, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
  slug: String;
}

export default function Main({ user, slug }: DetailProps) {

  
  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    createdAt: string;
    slug: string;
    
  }

  const [video, setVideo] = useState<Video | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [Type, setType] = useState<number>(1);
  const [Price1, setPrice1] = useState<number | null>(null);
  const [Price2, setPrice2] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const options = [
    { label: 'ส่วนตัว', value: 0 },
    { label: 'สาธารณะ', value: 1 },
    { label: 'เนื้อหาพิเศษ', value: 2 },
  ];

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const res = await axios.post("/api/getvideobyid", { videoId:slug });
        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setType(res.data.type);
        setPrice1(res.data.price_rent || null);
        setPrice2(res.data.price_sell || null);
      } catch (error) {
        console.error("Failed to load video data:", error);
      }
    };
  
    fetchVideoData();
  }, [slug]);
  

  const updateVideoData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("videoId", String(slug)); 
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", Type.toString());
      if (Price1 !== null) formData.append("price_rent", Price1.toString());
      if (Price2 !== null) formData.append("price_sell", Price2.toString());
      if (thumbnail) formData.append("thumbnail", thumbnail);
  
      await axios.post("/api/editvideo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("แก้ไขเรียบร้อย")

      router.push(`/dashboard/video`)

    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("เกิดข้อผิดพลาด")
    } finally {
      setLoading(false);
    }
  };
  

      

 

  return (
    <form className="lg:w-1/2 w-full mx-auto mt-6" onSubmit={updateVideoData}>
      <p className="text-gray-600 mb-3">ชื่อวิดีโอ</p>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="block w-full px-4 py-3 mb-4 border rounded"
      />

      <p className="text-gray-600 mb-3">คำอธิบายวิดีโอ</p>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="block w-full px-4 py-3 mb-4 border rounded"
      />

      <p className="text-gray-600 mb-3">ภาพปกวิดีโอ (อัปโหลดใหม่ถ้าต้องการเปลี่ยน)</p>
      {video && video.thumbnail && (
        <img src={video.thumbnail} alt="Current Thumbnail" className="w-32 h-20 rounded mb-2" />
      )}
      <input
        type="file"
        onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
        className="block w-full text-sm text-red-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-red-50 file:text-red-700
          hover:file:bg-red-100"
      />

      <p className="text-gray-600 mt-4">สถานะวิดีโอ</p>
      <div className="mt-3 mb-2 flex space-x-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value={option.value}
              checked={Type === option.value} 
              onChange={(e) => setType(Number(e.target.value))}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {Type === 2 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input
            type="number"
            placeholder="ราคาเช่า"
            value={Price1 !== null ? Price1 : ""}
            onChange={(e) => setPrice1(parseFloat(e.target.value) || null)}
            className="block w-full px-4 py-3 border rounded"
          />

          <input
            type="number"
            placeholder="ราคาขาย"
            value={Price2 !== null ? Price2 : ""}
            onChange={(e) => setPrice2(parseFloat(e.target.value) || null)}
            className="block w-full px-4 py-3 border rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        disabled={loading}
      >
        {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
      </button>
    </form>
  );


}