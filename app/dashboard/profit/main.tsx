"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';

export default function Main({ user }: { user: any }) {
  type Purchase = {
    id:string;
  }

  type Video = {
    id: string;
    title: string;
    description: string;
    price_rent: number;
    price_sell: number;
    path: string;
    type: number;
    rent: number;
    buy: number;
    thumbnail: string;
    view_count: number;
    Love_count: number;
    slugs: string;
    purchase: Purchase[];
  };

  type ApiResponse = {
    videos: Video[];
    hasMore: boolean;
  };

    

    const [profit, setProfit] = useState<Video[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);


    const fetchprofit = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/getmyprofit", { page });
            const result = response.data;

            setProfit((prev) => [...prev, ...result.videos]);
            setHasMore(result.hasMore);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    };


    
    useEffect(() => {
        const handleScroll = () => {
          if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading &&
            !isFetching
          ) {
            fetchprofit();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
            fetchprofit();
          hasFetchedInitialData.current = true; 
        }
      }, []);

    return(
        <>
        
        <p className="text-3xl font-bold">รายได้ของฉัน</p>

        <div className="grid grid-cols-1 gap-5 mt-8">
        {profit.map((videos) => (
        <div className="flex items-center mb-6">
            <div className="shrink-0 mr-[16px] my-4">
                <img
                className="mx-auto md:w-52 md:h-24 w-24 h-12 shrink-0 rounded-md"
                src={videos.thumbnail}
                />
            </div>
            <div className="flex flex-col grow min-w-0 mt-2 relative mt-3">
                <p className="font-bold md:text-md">{videos.title}</p>
                <p className="text-gray-600 mt-1 font-semibold">จำนวนผู้เช่า {videos.rent} ผู้ซื้อ {videos.buy} คน รวม : ฿{(videos.rent * videos.price_rent) + (videos.buy * videos.price_sell)}</p>
            </div>
            <Link href={`/dashboard/purchase/` + videos.id} className="inline-flex mr-1 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <ChartBarSquareIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg">ดูผู้ซื้อ</span>
                </Link>
            </div>
        ))}

        </div>
        
        </>
    )

}