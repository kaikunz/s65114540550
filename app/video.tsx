"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { EyeIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export const Fetchvideo = () => {

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch('/api/video')
          .then((response) => response.json())
          .then((data) => setVideos(data))
          .catch((error) => console.error('Error fetching videos:', error));
      }, []);
    
      return (
        <>
          <h1 className="mb-4 text-xl font-bold text-gray-700 ml-3">วิดีโอจากชุมชน</h1>


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