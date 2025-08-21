"use client";

import { ClockIcon, ShoppingBagIcon, HeartIcon, FlagIcon } from '@heroicons/react/24/outline';
import { useRef, useEffect, useState, Fragment } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Dialog,Transition } from '@headlessui/react'
import toast from 'react-hot-toast';
import LiveChat from './livechat'

interface LoveLog {
  id: string;
}

interface WatchVideosProps {
    id: string;
    title: string;
    description: string;
    price_rent: number;
    price_sell: number;
    path: string;
    type: number;
    Love_count: number;
    view_count: number;
    user: {
      name: string;
      follower: number;
      image: string;
    };
    hasPurchased: boolean;
    slugs: string;
    hasLoved:boolean;
    token: String;
    key: String;
    hasFollow: boolean;
    OwnerUserID: String;
    followcount: number;
    slug:string;
}
interface User {
  id: string;
  name: string;
  image?: string;
}

interface PostDetailProps {
  user: User | any;
  video: WatchVideosProps;
}



export default function WatchVideos({ user, video }: PostDetailProps) {


    let [isOpen, setIsOpen] = useState(false)
    const router = useRouter();

    const [text, SetText] = useState("");
    const [loveCount, setLoveCount] = useState<number>(video.Love_count || 0);
    const [hasLoved, setHasLoved] = useState<boolean>(video.hasLoved);
    const [comment, setComment] = useState<Comment[]>([]);
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("copyright");
    const [hasFollow, setHasFollow] = useState<boolean>(video.hasFollow); 
    const [FollowCount, setFollowCount] = useState<number>(video.followcount); 

    
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

    const toggleFollow = async () => {
      try {
        
        const followcheck = await axios.post("/api/follow", { followuserId: video.OwnerUserID});
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
    

    const Commentbtn = async () => {
      if (text) {
        const posts = {
            "text": text,
            "Id": video.id,
            "method": 2
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
        toast.success("แสดงความคิดเห็นแล้ว")
      } else {
        toast.error("คุณยังไม่ได้กรอกความคิดเห็น")
      }

    }

    const handleSendReport = async () => {
      try {
        const response = await axios.post("/api/sendreport", { id: video.id,reason: reason });
     
        setIsOpen(false)

        if (response.status === 200) {
            toast.success("รายงานสำเร็จ");
        }

        
      } catch (error: any) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          console.error("Failed to send report:", error.message);
        }
      }
    };

    const handleLoveClick = async () => {
      try {
        const response = await axios.post("/api/addlove", { id: video.id,method: 4 });
        const { type } = response.data;
     
    
          setHasLoved(type === 1); 
          setLoveCount((prev) => (type === 1 ? prev + 1 : prev - 1));

        
      } catch (error) {
        console.error("Failed to update love count:", error);
      }
    };
    

    const LoveClick = async (postId: string) => {
      try {
        const response = await axios.post("/api/addlove", { id: postId, method:3 });
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
    
      
    

    const Purchasevideo = async (action: "rent" | "buy") => {
        const actionText = action === "rent" ? "เช่า" : "ซื้อ";
        const successMessage =
          action === "rent"
            ? "เช่าสำเร็จระบบจะพาคุณไปยังหน้าประวัติ!"
            : "ซื้อสำเร็จระบบจะพาคุณไปยังหน้าประวัติ!";
    
        const result = await Swal.fire({
          title: "คุณแน่ใจแล้วใช่ไหม?",
          text: `ว่าจะ${actionText}วิดีโอนี้?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#850fd7",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน!",
          cancelButtonText: "ยกเลิก",
        });
    
        if (result.isConfirmed) {
          try {
            const response = await fetch(`/api/${action}`, {
              next: { revalidate: 0 },
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                videoId: video.id,
              }),
            });
    
            if (!response.ok) {
              throw new Error("Failed to perform the action.");
            }
    
            const data = await response.json();
            console.log("API Response:", data);
    
            const swalsuccess = await Swal.fire({
                title: "Success!",
                text: successMessage,
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
    
    //   const [videos, setVideos] = useState(null);
    //   const { slug } = params;

    //   useEffect(() => {
    //     const fetchExtraData = async () => {
    //       try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({ slug }),
    //         });
    
    //         if (!res.ok) {
    //           throw new Error("Failed to fetch extra data");
    //         }
    
    //         const data = await res.json();
    //         setVideos(data);
    //       } catch (error) {
    //         console.error("Error fetching extra data:", error);
    //       }
    //     };
    
    //     fetchExtraData();
    //   }, [slug]);
    
    const videoPath = video?.path || "default-path";
    const datavPath = video?.path || "default-path";

    type ApiResponse = {
      comment: Comment[];
      hasMore: boolean;
    };

    

    const fetchComment = async () => {
      if (isFetching || !hasMore || loading) return; 
      setIsFetching(true);
      setLoading(true);

      try {
          const response = await axios.post<ApiResponse>("/api/getcomments", { page:page, Id:video.id, method:2 });
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
    
  
  const url = `https://chickeam.com/play?test=https://chickeam.com/temp/${videoPath}/playlist.m3u8`;
  const url2 = `http://localhost:5000/play/${video?.key}`;
  const url3 = `http://localhost:4000/play/${video?.path}`;
  //const url3 = `http://live.chickeam.com/play/${datav?.path}`;
  //const url2 = `https://chickeam.com/play?test=https://chickeam.com/temp/${datavPath}`;
  
 

  return (
    <>
  <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    รายงานวิดีโอ
                  </Dialog.Title>
                  <form>
                  <div className="mt-2">
                  <select onChange={(e) => setReason(e.target.value)} 
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-red-300 border-gray-300"
                  >
                    <option disabled>เลือกเหตุผล</option>
                    <option value="copyright">เนื้อหาละเมิดลิขสิทธิ์</option>
                    <option value="violence">มีความรุนแรงหรือไม่เหมาะสม</option>
                    <option value="porn">มีเนื้อหาลามกหรืออนาจาร</option>
                    <option value="misleading">มีข้อมูลเท็จหรือบิดเบือน</option>
                    <option value="hateSpeech">มีคำพูดสร้างความเกลียดชัง</option>
                    <option value="privacy">มีการละเมิดความเป็นส่วนตัว</option>
                    <option value="spam">มีพฤติกรรมหลอกลวงหรือสแปม</option>
                  </select>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSendReport}
                    >
                      รายงาน
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      ปิด
                    </button>
                  </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">

        {video.type === 1 || video.hasPurchased == true ? (
        
          <div className="rounded-lg shadow">
            <iframe className="w-full aspect-video rounded-lg" src={video.type === 5 ? url3:url2}></iframe>
          </div>
        ) : (
          <div className="relative bg-black rounded-lg shadow w-full h-[484px]">
            <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-lg font-bold text-white text-center">
                เนื้อหาดังต่อไปนี้เป็นเนื้อหาพิเศษในการเข้าถึง
              </p>
              <div className="flex justify-center py-2">
                <button
                  className="text-lg font-bold text-white bg-red-600 rounded-lg px-6 py-2 hover:bg-red-700"
                  onClick={() => Purchasevideo('rent')}
                >
                  <ClockIcon className="w-6 inline-flex mr-1" /> เช่า 30 วัน ฿{video.price_rent}
                </button>
                <button
                  className="text-lg font-bold text-white bg-red-600 rounded-lg ml-4 px-6 py-2 hover:bg-red-700"
                  onClick={() => Purchasevideo('buy')}
                >
                  <ShoppingBagIcon className="w-6 inline-flex mr-1" /> ซื้อ ฿{video.price_sell}
                </button>
              </div>
            </div>
          </div>
        )}
          <p className="text-3xl mt-6 font-bold">{video.title}</p>
          <p className="text-sm mt-3">{video.type > 0 && video.type < 4 ? "เข้าชม":""} {video.type > 0 && video.type < 4 ? video.view_count + "ครั้ง":""}</p>
          <div className="flex items-center mb-6">
            <div className="shrink-0 mr-[16px] my-4">
                <img className="mx-auto md:size-12 size-16 shrink-0 rounded-full" src={video.user?.image ? video.user.image : "/images/default.png"} alt={video.user.name} />
            </div>
            
            <div className="flex flex-col grow min-w-0 mt-2 mt-3 relative">
            <Link href={`/profiles/${video.OwnerUserID}`}>
                <p className="font-bold md:text-md">{video.user.name}</p>
                <p className="text-gray-600 mt-1 font-semibold">
                    ผู้ติดตาม {FollowCount} คน
                </p>
            </Link>
                <div className="absolute right-0 top-0">
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

        <div className="flex justify-end gap-2">

        <button
        onClick={handleLoveClick}
        className={`inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold
          ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 
          ${hasLoved ? "text-red-600" : "text-gray-900"}`}
      >
        <HeartIcon className={`size-6 ${hasLoved ? "fill-red-600 text-red-600" : ""}`} />
        <span className="mt-[2px] ml-[10px] text-lg">
          {loveCount === 0 ? "รักเลย" : loveCount}
        </span>
      </button>
      

        <button onClick={() => setIsOpen(true)} className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                    <FlagIcon className="size-6" />
                    <span className="mt-[2px] ml-[12px] text-lg">รายงาน</span>
        </button>

        </div>

          <div className="mt-6 bg-gray-100 rounded-lg p-2">{video.description}</div>

          

        </div>

        <div>

        <div className="p-2">
    <p className="text-xl font-bold">{video.type === 5 ? "Live Chat" : "ความคิดเห็น"}</p>

    {video.type === 5 ? (
        <LiveChat liveId={video.slug} user={user} />
    ) : (
        <>
            <div className="mt-4">
                <div className="flex flex-row w-full">
                    <div className="mr-1 lg:mr-2">
                        <img
                            src={user?.image ? user.image : "/images/default.png"}
                            className="object-cover h-[45px] w-[45px] min-w-[45px] min-h-[45px] rounded-full"
                        />
                    </div>
                    <div className="flex flex-col p-3 rounded-xl bg-gray-200 w-full">
                        <textarea
                            className="resize-none border-0 bg-transparent outline-none w-full"
                            id="commenttext"
                            maxLength={500}
                            onChange={(e) => SetText(e.target.value)}
                            placeholder="แสดงความคิดเห็น"
                            style={{ height: "auto" }}
                            defaultValue={""}
                        />
                        <div className="flex justify-end">
                            <button onClick={Commentbtn} className="sendcomment rounded-md">
                                ส่ง
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-8">
                {comment.map((comment) => (
                    <div className="mb-8">
                        <div className="flex flex-row w-full">
                            <div className="mr-1 lg:mr-2">
                                <img
                                    src={comment.user?.image}
                                    alt="UserProfilePicture"
                                    className="object-cover h-[45px] w-[45px] min-w-[45px] min-h-[45px] rounded-full"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-sm font-bold text-gray-500">
                                    {comment.user?.name} <span className="ml-1 text-gray-500">•</span>{" "}
                                    <span className="ml-1 font-normal text-gray-500">{comment.createdAt}</span>
                                </p>
                                <p className="mt-1 ml-1">{comment.comment}</p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => LoveClick(comment.id)}
                                        className={`${
                                            comment.love_log?.length > 0 ? "text-red-600" : "text-black"
                                        } w-24 mt-1 group flex items-center text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full`}
                                    >
                                        <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24">
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
        </>
    )}
</div>


        </div>

      </div>

    </>
  );
}

