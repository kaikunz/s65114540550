"use client";

import axios from "axios";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    image?: string;
  }

  type Video = {
    id: string;
    title: string;
    description: string;
    price_rent: number;
    price_sell: number;
    path: string;
    type: number;
    thumbnail: string;
    view_count: number;
    Love_count: number;
    slugs: string;
  };

interface DetailProps {
    user: User | any;
    slug: String;
  }

export default function Main({ user, slug }: DetailProps) {

    const [commentCount, setCommentCount] = useState<number | null>(null);
    const [profit, setProfit] = useState<number | null>(null);
    const [video, setVideo] = useState<Video | null>(null);
    const FetchVideoDetail = async () => {
        try {
          const response = await axios.post("/api/getmyvideodetail", { id: slug });
          setVideo(response.data.video);
          setCommentCount(response.data.comment);

          const videos = response.data.video;
          setProfit((response.data.rent * videos.price_rent) + (response.data.buy * videos.price_sell))
        } catch (error) {
          console.error("Failed to fetch video detail:", error);
        }
      };

      useEffect(() => {
        if (slug) {
            FetchVideoDetail();
        }
      }, [slug]);

      if (!video) return <p>กำลังโหลดข้อมูลวิดีโอ...</p>;

    return(
        <>
        
        <Link href="/dashboard/video" className="inline-flex mb-4 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
            <ArrowUturnLeftIcon className="size-6" />
            <span className="mt-[2px] ml-[12px] text-lg">{video.title}</span>
        </Link>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">หัวใจ</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">{video.Love_count}</p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">ความคิดเห็น</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">{commentCount}</p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">รายได้จากวิดีโอ</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">{profit}</p>
                </div>
            </div>

        </div>
        
        </>
    )

}