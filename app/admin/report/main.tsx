"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
}

export default function Main({ user }: DetailProps) {

  

    interface Users {
        id:string;
        reason: string;
        text:string;
        video: {
          title:string;
          thumbnail:string;
          slug:string;
        }
        user: {
          name: string;
          image: string;
        },
        
        
      }

      

      type ApiResponse = {
        users: Users[];
        hasMore: boolean;
      };

      

    const [Users, setUsers] = useState<Users[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);
  const router = useRouter();
    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);


    const fetchUsers = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/admin/getreport", {page});
            const result = response.data;

            setUsers((prev) => [...prev, ...result.users]);
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
            fetchUsers();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
          fetchUsers();
          hasFetchedInitialData.current = true; 
        }
      }, []);


      const handleConfirmAndCallApi = async (id:string) => {
                   
                    const result = await Swal.fire({
                      title: "คุณแน่ใจแล้วใช่ไหม?",
                      text: `ว่าจะลบวิดีโอนี้ จะไม่สามารถกู้คืนได้?`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#850fd7",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "ยืนยัน!",
                      cancelButtonText: "ยกเลิก",
                    });
                
                    if (result.isConfirmed) {
                      try {
                        const response = await fetch(`/api/admin/delete`, {
                          next: { revalidate: 0 },
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: id,
                            method: 3
                          }),
                        });
                
                        if (!response.ok) {
                          throw new Error("Failed to perform the action.");
                        }
                
                        const data = await response.json();
                        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      
                
                        const swalsuccess = await Swal.fire({
                            title: "Success!",
                            text: "ลบสำเร็จ",
                            icon: "success",
                            confirmButtonText: "OK",
                          });
                          if (swalsuccess.isConfirmed) {
                            router.refresh();
                          }
                      
                        
                      } catch (error: any) {
                        Swal.fire("Error", error.message, "error");
                      }
                    }
                  };

    return(
        <>
        
        <p className="text-3xl font-bold">จัดการรายงาน</p>

        <div className="grid grid-cols-1 gap-5 mt-8">
        {Users.map((u) => (
        <div className="flex items-center mb-3 relative">
          <div className="shrink-0 mr-[16px] my-4"><img className="mx-auto md:size-12 size-16 shrink-0 rounded-full" src={u.user.image}/></div>
            <div className="flex flex-col grow min-w-0 mt-2 relative mt-3">
                <p className="font-bold md:text-md">{u.user.name}</p>
                <p className="text-gray-600 mt-1 font-semibold">{u.reason} - {u.video?.title || "วิดีโอไม่พบ"}
  {u.video?.slug && (
    <Link href={`/watch/${u.video.slug}`} className="text-red-500 underline"> ดูวิดีโอ</Link>
  )}</p>
            </div>
            <div className="absolute right-0 top-0">
                
                <button onClick={() => handleConfirmAndCallApi(u.id)} className="inline-flex mr-1 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <TrashIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg md:block hidden">ลบวิดีโอ</span>
                </button>

                </div>
            </div>
        ))}

        </div>
        
        </>
    )

}