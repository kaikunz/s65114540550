"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  slug: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default function SearchVideo({ user }: DetailProps) {

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ โหลดข้อมูลครั้งแรก
  useEffect(() => {
    if (!query) return;
    setVideos([]); // เคลียร์ข้อมูลเมื่อ query เปลี่ยน
    setPage(1);
    setHasMore(true);
    fetchVideos(1, true);
  }, [query]);

  // ✅ โหลดข้อมูลเพิ่มเมื่อ scroll ลงสุด
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        fetchVideos(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page]);

  const fetchVideos = async (currentPage: number, isNewSearch = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/searchvideos", {
        query,
        page: currentPage,
        pageSize: 5,
      });

      setVideos((prev) => (isNewSearch ? res.data.videos : [...prev, ...res.data.videos]));
      setHasMore(res.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };


    return(
        <>
        
        <div className="">
      <h1 className="text-2xl font-bold mb-4">🔍 ผลลัพธ์การค้นหา: {query}</h1>

      {videos.length === 0 && !loading && <p className="text-gray-500">ไม่พบวิดีโอ</p>}

      <ul className="space-y-4">
        {videos.map((video) => (
          <li key={video.id} className="p-4 border-b flex">
            <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded-md mr-4" />
            <div>
              <p className="font-semibold">{video.title}</p>
              <p className="text-gray-500 text-sm">โดย {video.user.name}</p>
            </div>
          </li>
        ))}
      </ul>

      {loading && <p className="text-center text-gray-500 mt-4">กำลังโหลด...</p>}
    </div>
       
        </>
    )

}