"use client";

import { EyeIcon,LockClosedIcon } from '@heroicons/react/24/outline';
import { useRef, useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from 'react-hot-toast';

interface LoveLog {
  id: string;
}

interface User {
  id: string;
  name: string;
  image?: string;
}

interface UserFetch {
  id: string;
  name: string;
  image?: string;
}

interface ProfileProps {
    user: UserFetch;
    hasFollow: boolean;
    followcount: number;
}


interface PostDetailProps {
  user: User | any;
  profile: ProfileProps;
}

type Video = {
  id: string;
  title?: string;
  userId: string;
  description?: string;
  thumbnail?: number;
  createdAt: string;
  updatedAt: string;
  view_count: number;
  slug: string;
  createdAtAgo: String;
  viewCountFormatted: String;
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

export default function ProfileUser({ user, profile }: PostDetailProps) {


    const router = useRouter();

    const [hasFollow, setHasFollow] = useState<boolean>(profile.hasFollow); 
    const [FollowCount, setFollowCount] = useState<number>(profile.followcount); 
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);

    
    const toggleFollow = async () => {
      try {
        
        const followcheck = await axios.post("/api/follow", { followuserId: profile.user.id});
        const result = followcheck.data;

        if (result.followed) {
          setFollowCount((prev) => prev + 1);
        } else {
          setFollowCount((prev) => Math.max(prev - 1, 0)); 
        }

        setHasFollow(result.followed);
      } catch (error) {
        console.error("Failed to update follow status:", error);
      }
    };


    const fetchVideos = async () => {
      if (isFetching || !hasMore || loading) return; 
      setIsFetching(true);
      setLoading(true);

      try {
          const response = await axios.post<ApiResponse>("/api/getvideobyuserid", { page, userId: profile.user.id });
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
          fetchVideos();
        }
      };
    
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, isFetching]);
    
  
    useEffect(() => {
      if (!hasFetchedInitialData.current) {
        fetchVideos();
        hasFetchedInitialData.current = true;
      }
    }, []);
  

  return (
    <>
    <div className="w-full md:h-48 h-24 bg-gray-200 rounded-xl mb-3"></div>

    <div className="flex items-center mb-6">
      <div className="shrink-0 mr-[16px] my-4">
        <img
          className="mx-auto md:size-32 size-16 shrink-0 rounded-full"
          src={profile.user.image}
          alt=""
        />
      </div>
      <div className="flex flex-col grow min-w-0 mt-2">
        <p className="font-bold md:text-3xl text-xl">{profile.user.name}</p>
        <p className="text-gray-600 mt-1 font-semibold">
          <span className="ml-1 text-gray-500">ผู้ติดตาม {FollowCount} คน</span>
        </p>
        <div className="inline-flex">
          <button
            onClick={toggleFollow}
            className={`rounded-lg md:p-2 p-1 font-bold w-24 mt-2 ${
              hasFollow ? "bg-white border border-gray-400" : "bg-red-600 text-white hover:bg-red-500"
            }`}
          >
            {hasFollow ? "ติดตามแล้ว" : "ติดตาม"}
          </button>
        </div>
      </div>
    </div>

<p className='text-3xl font-bold my-8'>วิดีโอที่อัปโหลด</p>
    
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
                    <p className="text-left font-bold text-gray-600 text-sm inline-flex truncate">
                      <span className="mr-[6px]"><EyeIcon className="w-5" /></span> {video.viewCountFormatted}
                      <span className="ml-2 text-gray-500">•</span>
                      <span className="text-gray-500 ml-2">{video.createdAtAgo}</span>
                      </p>
    
                  </div>
                </div>

                {video.type == 2 ? <span className="absolute left-0 top-0 rounded-b-lg bg-red-500 text-white font-bold p-2"><LockClosedIcon className="w-5 stroke-4"/></span> : ""}

              </Link>
            ))}
          </div>


    </>
  );
}

