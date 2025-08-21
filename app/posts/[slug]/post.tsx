"use client";

import {useRef, useEffect, useState } from "react";
import axios from "axios";

interface Video {
    id?: string;
    title?: string;
  }
  
  interface LoveLog {
    id: string;
  }
  
  interface Post {
    id: string;
    content: string;
    userId: string;
    videoId: string | null;
    Love_count: number;
    createdAt: string;
    updatedAt: string;
    user: User;
    video: Video | null;
    love_log: LoveLog[];
  }

  interface User {
    id: string;
    name: string;
    image?: string;
  }

  interface PostDetailProps {
    user: User | any;
    post: Post;
  }

export default function PostDetail({ user, post }: PostDetailProps) {

    
    const [currentPost, setCurrentPost] = useState<Post>(post);
    const [text, SetText] = useState("");

    const Commentbtn = async () => {
        const posts = {
            "text": text,
            "Id": post.id,
            "method": 1
        }
        const response = await axios.post("/api/sendcomment", posts);
        const newPost = {
            ...response.data.posts,
            user: {
              id: user.id,
              name: user.name,
              image: user.image || "/images/default.png",
            },
          };
          
          
        setComment((prevPosts) => [newPost, ...prevPosts]);

    }


    const LoveClick = async (postId: string) => {
        try {
          const response = await axios.post("/api/addlove", { id: postId, method:1 });
          const { type, post: updatedPost } = response.data;
      
          setCurrentPost((prevPost) =>
            prevPost.id === updatedPost.id
              ? {
                  ...prevPost,
                  Love_count: updatedPost.Love_count, // อัปเดตจำนวน Love_count
                  love_log: type === 1
                    ? [{ id: "new-love-log-id" }] // เพิ่ม love_log
                    : [], // ลบ love_log
                }
              : prevPost
          );
        } catch (error) {
          console.error("Failed to update love count:", error);
        }
      };

      const LoveClick2 = async (postId: string) => {
        try {
          const response = await axios.post("/api/addlove", { id: postId, method:2 });
          const { type, post } = response.data;
      
          setComment((prevPosts) =>
            prevPosts.map((p) =>
              p.id === post.id
                ? {
                    ...p,
                    Love_count: post.Love_count, 
                    love_log: type === 1
                      ? [{ id: "new-love-log-id" }] 
                      : [], 
                  }
                : p
            )
          );
        } catch (error) {
          console.error("Failed to update love count:", error);
        }
      };

    const [comment, setComment] = useState<Comment[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedInitialData = useRef(false);
    
    type Comment = {
        id: string;
        comment?: string;
        userId: string;
        videoId?: string;
        postId?: string;
        Love_count?: number;
        createdAt: string;
        updatedAt: string;
        user?: {
          id: string;
          name: string;
          image: string;
        };
        love_log: LoveLog[];
      };

    type ApiResponse = {
        comment: Comment[];
        hasMore: boolean;
      };

    const fetchComment = async () => {
        if (isFetching || !hasMore || loading) return; 
        setIsFetching(true);
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>("/api/getcomments", { page:page, Id:post.id, method:1 });
            const result = response.data;

            setComment((prev) => [...prev, ...result.comment]);
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
            fetchComment();
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [hasMore, loading, isFetching]);
      
    
      useEffect(() => {
        if (!hasFetchedInitialData.current) {
            fetchComment();
          hasFetchedInitialData.current = true; // ป้องกันการดึงข้อมูลซ้ำ
        }
      }, []);

    return(
        <>

<div className="md:w-3/5 w-full mx-auto border border-gray-200 h-auto ">
  <div className="flex">
  </div>
  <div>       
  <div className="flex flex-shrink-0 p-4 pb-0">
    <a href="" className="flex-shrink-0 group block">
      <div className="flex items-center">
        <div>
          <img
            className="inline-block h-10 w-10 rounded-full"
            src={user?.image ? user.image : "/images/default.png"}
            alt=""
          />
        </div>
        <div className="ml-3">
          <p className="text-base leading-6 font-medium">
            {user?.name ? user.name : "No name"}
            <span className="text-sm leading-5 ml-2 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
            {post?.createdAt ? post.createdAt : "1 มกราคม 2569"}
            </span>
          </p>
        </div>
      </div>
    </a>
  </div>
  <div className="pl-16">
    <p className="text-base width-auto font-medium flex-shrink">
    {post?.content ? post.content : "No content"}
    </p>
    <div className="flex">
      <div className="w-full">
        <div className="flex items-center">
          <div className="text-center py-2">
          <button
            onClick={() => LoveClick(post.id)}
            className={`${
                currentPost.love_log?.length > 0 ? "text-red-600" : "text-black"
            } w-24 mt-1 group flex items-center text-gray-500 py-2 text-base leading-6 font-medium rounded-full`}
            >
            <svg
                className="text-center h-7 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="ml-2">{currentPost.Love_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr className="border-gray-300" />
  </div>

  <div className="p-2 px-4 mt-2">
    <p className="text-lg font-bold">ความคิดเห็น</p>

    <div className="mt-4">
  <div>
    <div className="flex flex-row w-full">
      <div className="mr-1 lg:mr-2">
        <div className="hidden lg:block">
          <img
            src={user?.image ? user.image : "/images/default.png"}
            className="object-cover h-[45px] w-[45px] min-w-[45px] min-h-[45px] rounded-full"
          />
        </div>
        <div className="lg:hidden">
          <img
            src={user?.image ? user.image : "/images/default.png"}
            className="object-cover h-[40px] w-[40px] min-w-[40px] min-h-[40px] rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col p-3 rounded-xl bg-gray-200 w-full">
        <textarea
          className="resize-none border-0 bg-transparent outline-none w-full"
          id="commenttext"
          maxLength={500} onChange={(e) => SetText(e.target.value)}
          placeholder="แสดงความคิดเห็น"
          style={{ height: "auto" }}
          defaultValue={""}
        />
        <div className="flex justify-end">
          <button onClick={Commentbtn} className="sendcomment rounded-md">
            <svg
              id="iconsend"
              focusable="false"
              data-prefix="fas"
              data-icon="paper-plane"
              className="w-4 h-4 text-[#D45151] hover:text-[#FA001E]"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
              />
            </svg>
            <svg
              id="iconsending"
              xmlns="http://www.w3.org/2000/svg"
              className="hidden animate-spin w-4 h-4 text-[#D45151] hover:text-[#FA001E]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1={12} y1={2} x2={12} y2={6} />
              <line x1={12} y1={18} x2={12} y2={22} />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1={2} y1={12} x2={6} y2={12} />
              <line x1={18} y1={12} x2={22} y2={12} />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    <div className="mt-8">
    {comment.map((comment) => (
    <div className="mb-8">
  <div className="flex flex-row w-full">
    <div className="mr-1 lg:mr-2">
      <div className="hidden lg:block">
        <img
          src={comment.user?.image}
          alt="UserProfilePicture"
          className="object-cover h-[45px] w-[45px] min-w-[45px] min-h-[45px] rounded-full"
        />
      </div>
      <div className="lg:hidden">
        <img
          src={comment.user?.image}
          alt="UserProfilePicture"
          className="object-cover h-[40px] w-[40px] min-w-[40px] min-h-[40px] rounded-full"
        />
      </div>
    </div>
    <div className="flex flex-col w-full">
      <p className="text-sm font-bold text-gray-500 text-balance">
      {comment.user?.name} <span className="ml-1 text-gray-500">•</span>{" "}
        <span className="ml-1 font-normal text-gray-500">{comment.createdAt}</span>
      </p>
      <p className="mt-1 ml-1">
      {comment.comment}
      </p>
      <div className="mt-2">
      <button
            onClick={() => LoveClick2(comment.id)}
            className={`${
                comment.love_log?.length > 0 ? "text-red-600" : "text-black"
            } w-24 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full`}
            >
            <svg
                className="text-center h-7 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="ml-2">{comment.Love_count}</span>
            </button>
        
      </div>
      
      
    </div>
  </div>
</div>
))}
    </div>

  </div>

</div>

        </>
    )

}