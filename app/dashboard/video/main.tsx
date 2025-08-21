"use client";

import axios from "axios";
import { PencilSquareIcon, TrashIcon, ChartBarSquareIcon, EyeIcon, HeartIcon, ChatBubbleBottomCenterIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Main({ user }: { user: any }) {

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
        _count: count;
      };

      type count = {
        comment: number,
        purchase: number
      }

      type ApiResponse = {
        videos: Video[];
        hasMore: boolean;
      };

    const [video, setVideo] = useState<Video[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);
    const router = useRouter();


    const fetchVideo = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/getmyvideos", { page });
            const result = response.data;
            

            setVideo((prev) => [...prev, ...result.videos]);
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
            fetchVideo();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
          fetchVideo();
          hasFetchedInitialData.current = true; 
        }
      }, []);

      const Deletevideo = async (id:string) => {
                         
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
                              const response = await fetch(`/api/delete`, {
                                next: { revalidate: 0 },
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  id: id,
                                  method: 1
                                }),
                              });
                      
                              if (!response.ok) {
                                throw new Error("Failed to perform the action.");
                              }
                      
                              const data = await response.json();
                              setVideo((prevVideos) => prevVideos.filter((video) => video.id !== id));
      
                      
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

                        const videoTypeMap: Record<number, string> = {
                        0: "ส่วนตัว",
                        1: "สาธารณะ",
                        2: "เฉพาะสมาชิก",
                        3: "ขายวิดีโอ",
                        4: "ให้เช่า",
                        5: "กำลังถ่ายทอดสด",
                        6: "ยุติการถ่ายทอดสด",
                      };

    return(
        <>
        
        <p className="text-3xl font-bold">วิดีโอของฉัน</p>

        <div className="grid grid-cols-1 gap-5 mt-8">
        {video.map((videos) => (
        <div className="flex items-center mb-6">
            <div className="shrink-0 mr-[16px] my-4">
                <img
                className="mx-auto md:w-52 md:h-24 w-24 h-12 shrink-0 rounded-md"
                src={videos.thumbnail}
                />
            </div>
            <div className="flex flex-col grow min-w-0 mt-2 relative mt-3">
                <p className="font-bold md:text-md">{videos.title}</p>
                <div className="inline-flex mt-2">
                  
                  <EyeIcon className="size-5 mr-1 mt-[1px]" /> 
                  <span className="">{videos.view_count} </span>
                  <span className="text-gray-500 ml-3">•</span>  
                  <HeartIcon className="size-5 ml-2 mr-1 mt-[1px]" /> 
                  <span className="">{videos.Love_count} </span>
                  <span className="text-gray-500 ml-3">•</span>  
                  <ChatBubbleBottomCenterIcon className="size-5 ml-2 mr-1 mt-[1px]" /> 
                  <span className="">{videos._count.comment} </span>
                  <span className="text-gray-500 ml-3">•</span>  
                  <BanknotesIcon className="size-5 ml-2 mr-1 mt-[1px]" /> 
                  <span className="">{videos._count.purchase} </span>
                  <span className="text-gray-500 ml-3">•</span>  
                  <span className="ml-2">{videoTypeMap[videos.type] ?? "ไม่ทราบประเภท"}</span>
                </div>
                <div className="absolute right-0 top-0">
                
                <Link href={`/dashboard/analysis/` + videos.id} className="inline-flex mr-1 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <ChartBarSquareIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg md:block hidden">ข้อมูลเชิงลึก</span>
                </Link>
                <Link  href={`/dashboard/edit/` + videos.id} className="inline-flex mr-1 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <PencilSquareIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg md:block hidden">แก้ไข</span>
                </Link>
                <button onClick={() => Deletevideo(videos.id)} className="inline-flex mr-1 items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <TrashIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg md:block hidden">ลบ</span>
                </button>

                </div>
            </div>
            </div>
        ))}

        </div>
        
        </>
    )

}