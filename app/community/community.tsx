"use client";
import {useRef, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


export default function Communitys({ user }: { user: any }) {

    const [text, SetText] = useState("");
    const [AfterClick, setAfterClick] = useState<string[]>([]);


    const Postbtn = async () => {
      if (text) {
        const posts = {
            "text": text
        }
        const response = await axios.post("/api/sendpost", posts);
        const newPost = {
            ...response.data.posts,
            user: {
              id: user.id,
              name: user.name,
              image: user.image || "/images/default.png",
            },
          };
          
          
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        toast.success("สร้างโพสต์เรียบร้อย")
      } else {
        toast.error("คุณยังไม่ได้กรอกโพสต์")
      }

    }

    const LoveClick = async (postId: string) => {
        try {
          const response = await axios.post("/api/addlove", { id: postId, method:1 });
          const { type, post } = response.data;
      
          setPosts((prevPosts) =>
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
      
      
      type LoveLog = {
        id: string;
      };

    type Post = {
        id: string;
        content?: string;
        userId: string;
        videoId?: string;
        Love_count?: number;
        createdAt: string;
        updatedAt: string;
        user?: {
          id: string;
          name: string;
          image: string;
        };
        video?: {
          id: string;
          title?: string;
        };
        love_log: LoveLog[];
      };

      type ApiResponse = {
        posts: Post[];
        hasMore: boolean;
      };

    const [posts, setPosts] = useState<Post[]>([]);
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
            const response = await axios.post<ApiResponse>("/api/getposts", { page });
            const result = response.data;

            setPosts((prev) => [...prev, ...result.posts]);
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
          hasFetchedInitialData.current = true; // ป้องกันการดึงข้อมูลซ้ำ
        }
      }, []);
      
    

    return (
    <>

<div className="md:w-3/5 w-full mx-auto border border-gray-200 h-auto ">
  <div className="flex">
    <div className="flex-1 m-2">
      <h2 className="px-4 py-2 text-xl font-semibold text-black">โพสต์จากชุมชน</h2>
    </div>
  </div>
  <hr className="border-gray-200" />

  <div className="flex">
    <div className="m-2 w-10 py-1">
      <img
        className="inline-block h-10 w-10 rounded-full"
        src={user?.image ? user.image : "/images/default.png"}
        alt=""
      />
    </div>
    <div className="flex-1 px-2 pt-2 mt-2">
      <textarea
        className=" bg-transparent text-gray-400 font-medium text-lg w-full"
        rows={2}
        cols={50} onChange={(e) => SetText(e.target.value)}
        placeholder="คุณกำลังคิดอะไรอยู่?"
        defaultValue={""}
      />
    </div>
  </div>
  <div className="flex">
    <div className="w-10" />
    <div className="w-14 px-2">
      <div className="flex items-center">
        <div className="flex-1 text-center px-1 py-1 m-2">
          <a
            href="#"
            className="mt-1 group flex items-center text-red-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300"
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
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div className="flex-1">
      <button onClick={Postbtn} className="bg-red-500 mt-5 hover:bg-red-600 text-white font-bold py-2 px-8 rounded-full mr-8 float-right">
        โพสต์
      </button>
    </div>
  </div>
  <hr className="border border-gray-300" />
    {posts.map((post) => (
  <div>       
  <div className="flex flex-shrink-0 p-4 pb-0">
    <a href={"/posts/" + post.id} className="flex-shrink-0 group block">
      <div className="flex items-center">
        <div>
          <img
            className="inline-block h-10 w-10 rounded-full"
            src={post?.user?.image ? post.user.image : "/images/default.png"}
            alt=""
          />
        </div>
        <div className="ml-3">
          <p className="text-base leading-6 font-medium">
            {post?.user?.name ? post.user.name : "No name"}
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
          <div className="text-center">
            <a
              href={"/posts/" + post.id}
              className="w-12 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-gray-300"
            >
              <svg
                className="text-center h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </a>
          </div>
          <div className="text-center py-2 m-2">
          <button
            onClick={() => LoveClick(post.id)}
            className={`${
                post.love_log?.length > 0 ? "text-red-600" : "text-black"
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
            <span className="ml-2">{post.Love_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr className="border-gray-300" />
  </div>
))}
{loading && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a2" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF0000"></stop><stop offset=".3" stop-color="#FF0000" stop-opacity=".9"></stop><stop offset=".6" stop-color="#FF0000" stop-opacity=".6"></stop><stop offset=".8" stop-color="#FF0000" stop-opacity=".3"></stop><stop offset="1" stop-color="#FF0000" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a2)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF0000" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>}

</div>

    
    </> )

}