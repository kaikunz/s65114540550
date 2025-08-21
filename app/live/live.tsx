"use client";
import {useRef, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { EyeIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';


export default function Lives({ user }: { user: any }) {

    const [text, SetText] = useState("");
    const [AfterClick, setAfterClick] = useState<string[]>([]);


      
      type LoveLog = {
        id: string;
      };

    type Video = {
        id: string;
        title?: string;
        userId: string;
        description?: string;
        thumbnail?: number;
        createdAt: string;
        updatedAt: string;
        slug: string;
        user?: {
          id: string;
          name: string;
          image: string;
        };
      };

      type ApiResponse = {
        video: Video[];
        hasMore: boolean;
      };

    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);


    const fetchPosts = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/getlive", { page });
            const result = response.data;

            setVideos((prev) => [...prev, ...result.video]);
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
            fetchPosts();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
          fetchPosts();
          hasFetchedInitialData.current = true; 
        }
      }, []);
      
    

    return (
    <>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 gap-y-6 relative px-1 md:px-4 ml-1">
            {videos.map((video: any) => (
              <Link href={`/watch/${video.slug}`} className="relative hover:bg-gray-50">
                <img src={video.thumbnail} className="bg-cover bg-center w-full aspect-video rounded-xl" />
                <h2 className="my-2 text-lg font-semibold truncate">{video.title || 'Untitled'}</h2>
                <div className="inline-flex items-start min-w-max rounded-lg mr-4">
                  <img src={video.user?.image ? video.user.image : "/images/default.png"} className="w-12 h-12 rounded-full mr-4" alt="Profile Image" />
                  <div>
                    <p className="block text-left font-bold text-md mb-1 truncate">
                      {video.user.name}
                    </p>
    
                  </div>
                </div>

                {video.type == 2 ? <span className="absolute left-0 top-0 rounded-b-lg bg-red-500 text-white font-bold p-2"><LockClosedIcon className="w-5 stroke-4"/></span> : ""}

              </Link>
            ))}
          </div>

    
    </> )

}