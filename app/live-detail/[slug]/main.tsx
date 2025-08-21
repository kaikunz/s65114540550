"use client";

import axios from "axios";
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
  slug: string;
}


const socket = io("http://localhost:3000", { path: "/connectwebsocket" });

export default function LiveDetail({ user, slug }: DetailProps) {
  type Live = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
    path: string;
    view_count: number;
    createdAt: string;
    updatedAt: string;
    OwnerUserID: string;
  };
  
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  
  const calllive = async () => {
    try {


      const res2 = await axios.post("/api/getvideo", { slug: slug, edit:1 });

      if (res2.status === 200) {
        const result = await res2.data;
        setData(result);
      }

      
    } catch (error: any) {
      console.error("Error in videotypeistwo:", error.message);
    }
  };

  const CallCheckStream = async () => {

    if (data) {
      //const html = `http://live.chickeam.com/stream/${data.path}/index.m3u8`;
      const html = `http://localhost:4000/streaming/${data.path}.m3u8`;
      
      try {
        const check = await axios.get(html, { validateStatus: () => true });

        if (check.status === 200) {
          toast.success("พบสัญญาน")
          const checkarea = document.getElementById("checksignal");
          const live = document.getElementById("preview");
          const btn = document.getElementById("btnstartstream");

          //const htmlforvideo = `<div class="flex justify-center"><iframe width="1280" height="720" src="http://live.chickeam.com/play/${data.path}"></iframe></div>`;

        const htmlforvideo = `
          <div class="flex justify-center">
          <iframe width="1280" height="720" src="http://localhost:4000/play/${data.path}"></iframe>
        </div>
        
        `;

          if (checkarea) checkarea.classList.add("hidden");
          if (live) live.innerHTML = htmlforvideo;
          if (btn) btn.classList.remove("hidden");
          

        } else {
          toast.error("ยังไม่พบสัญญาน กรุณาลองใหม่อีกครั้ง");
        }
      } catch (error: any) {
        console.error("Error Something:", error.message);
        toast.error(error.message)
      }
    }

  }


  const StartStream = async () => {
    
    if (data) {
      //const html = `http://live.chickeam.com/stream/${data.path}/index.m3u8`;
      const html = `http://localhost:4000/streaming/${data.path}.m3u8`;
      

      try {
        const check = await axios.get(html, { validateStatus: () => true });

        if (check.status === 200) {
          toast.success("เริ่มสตรีมแล้ว")
          
          const host = { id: user.id, name: user.name, image: user.image };
          socket.emit("create-liveroom", { liveId:slug, host });

          socket.on("room-created", (room) => {
            toast.success(`ห้อง "${room.liveId}" ถูกสร้างโดย ${room.host.name}`);
        });


          const res2 = await axios.post("/api/livestart", { slug: slug, });

          if (res2.status === 200) {
            router.push(`/watch/${slug}`)
          }

        } else {
          toast.error("ยังไม่พบสัญญาน กรุณาลองใหม่อีกครั้ง");
        }
      } catch (error: any) {
        console.error("Error Something:", error.message);
        toast.error(error.message)
      }
    }

  }

  useEffect(() => {
    calllive()
    }, []);

  if (!data) {
    return(<><p>Loading..</p></>)
  }

    return(
        <>
        
        <p className="text-3xl font-bold">สตรีมของคุณ</p>
        <p className="text-lg mt-5">{data.title}</p>

        <hr className="border border-gray-300 my-5"/>
        <div id="checksignal">
          <div className="mt-6">
            <p className="font-bold text-lg">1. นำลิงก์ข้างล่างนี้นำไปใส่ในโปรแกรม Broadcast หัวข้อ Server</p>
            <p className="bg-gray-200 text-center w-full font-bold text-2xl py-4 rounded-md">rtmp://localhost:1935/stream</p>
          </div>

          <div className="mt-6">
            <p className="font-bold text-lg">2. นำลิงก์ข้างล่างนี้นำไปใส่ในโปรแกรม Broadcast หัวข้อ Stream key</p>
            <p className="bg-gray-200 text-center w-full font-bold text-2xl py-4 rounded-md">{data.path}</p>
          </div>

          <div className="mt-6">
            <p className="font-bold text-lg">3. เมื่อเริ่มสตรีมในโปรแกรมแล้วให้กดปุ่มเรียกสตรีมด้านล่างนี้ก่อน</p>
            <button className="bg-red-500 text-center w-full font-bold text-2xl py-4 rounded-md text-white hover:bg-red-600" onClick={CallCheckStream}>เรียกสตรีม</button>
          </div>
        </div>

        <div id="preview" className="flex justify-center">

        </div>

        <div id="btnstartstream" className="hidden flex justify-center my-5">
        <button className="bg-red-500 text-center w-full font-bold text-2xl py-4 rounded-md text-white hover:bg-red-600" onClick={StartStream}>สตรีมตอนนี้เลย</button>
        </div>

        
        </>
    )

}