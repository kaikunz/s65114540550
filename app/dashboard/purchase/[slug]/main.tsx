"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';

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

  

    interface Purchase {
        id: string;
        type: number;
        userId: string;
        videoId: string | null;
        expire_date: string;
        createdAt: string;
        updatedAt: string;
        user: {
          name: string;
          follower: number;
          image: string;
        };
        video: {
          title:string;
        }
      }

      

      type ApiResponse = {
        purchase: Purchase[];
        hasMore: boolean;
      };

      

    const [purchase, setpurchase] = useState<Purchase[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);


    const fetchpurchase = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/getmypurchase", { page, slug:slug });
            const result = response.data;

            setpurchase((prev) => [...prev, ...result.purchase]);
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
            fetchpurchase();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
            fetchpurchase();
          hasFetchedInitialData.current = true; 
        }
      }, []);

    return(
        <>
        
        <p className="text-3xl font-bold">รายชื่อผู้ใช้</p>

        <div className="grid grid-cols-1 gap-5 mt-8">
        {purchase.map((purchases) => (
        <div className="flex items-center mb-6">
          <div className="shrink-0 mr-[16px] my-4"><img className="mx-auto md:size-12 size-16 shrink-0 rounded-full" src={purchases.user.image}/></div>
            <div className="flex flex-col grow min-w-0 mt-2 relative mt-3">
                <p className="font-bold md:text-md">{purchases.user.name}</p>
                <p className="text-gray-600 mt-1 font-semibold">{purchases.type === 1 ? "ซื้อ": "เช่า"}จากวิดีโอ {purchases.video.title}</p>
            </div>
            </div>
        ))}

        </div>
        
        </>
    )

}