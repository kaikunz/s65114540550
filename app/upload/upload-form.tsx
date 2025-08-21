"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from 'axios';
import { useRouter } from 'next/navigation'

export function generateRandomString(length: number = 7): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let randomString = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
}




const UploadForm = () => {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    setSlug(generateRandomString(10));
    setPath(generateRandomString(11));
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setdescription] = useState<string | null>(null);
  const [Thumbnail, setThumbnail] = useState<File | null>(null);
  const [Type, setType] = useState<string | null>(null);
  const [Price1, setPrice1] = useState<number | null>(null);
  const [Price2, setPrice2] = useState<number | null>(null);
  const [upscale, setUpscale] = useState(0); // ค่าเริ่มต้นเป็น 0 (ปิด)


 
  const options = [
    { label: 'ส่วนตัว', value: '0' },
    { label: 'สาธารณะ', value: '1' },
    { label: 'เนื้อหาพิเศษ', value: '2' },
  ];

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);

    const priceGroup = document.getElementById("pricegroup");
    if (priceGroup) {
      if (event.target.value === "2") {
        priceGroup.classList.remove("hidden");
      } else {
        priceGroup.classList.add("hidden");
        setPrice1(null);
        setPrice2(null);
      }
    }


  };


  const Uploadvideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    

    const formData = new FormData();
    
    if (slug) formData.append("slug", slug);
    if (path) formData.append("path", path);
    if (file) formData.append("file", file);
    if (upscale) formData.append("upscale", String(upscale));

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted); 
          }
        },
      });

      if (res.status === 200) {
        
        

        const videoData = {
          title: "No title yet",
          description : "No Description yet",
          thumbnail: "https://chickeam.com/nothumb.jpg",
          type: 0,
          price_rent: null,
          price_sell: null,
          slug: slug,
          path: path,
        };

        const res2 = await axios.post("/api/addvideo", videoData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res2.status === 201) {

          const form = document.getElementById("formvideo");
          const form2 = document.getElementById("formupload");
          const videoshow = document.getElementById("videoarea");

          const htmlforvideo = `<div className="rounded-lg shadow">
            <iframe className="w-full aspect-video rounded-lg" src="https://chickeam.com/play?test=https://chickeam.com/temp/${path}/playlist.m3u8"></iframe>
          </div>`;

          if (videoshow) {
            videoshow.innerHTML = htmlforvideo;
          }

          if (form) {
            form.classList.remove("hidden");
          } 
          if (form2) {
            form2.classList.add("hidden");
          } 
        }
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    }
  };

  const UpdateVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDatas = new FormData();
    if (Thumbnail) formDatas.append("thumbnail", Thumbnail);

    formDatas.append("title", title || "Untitled");
    formDatas.append("description", description || "");
    formDatas.append("type", Type || "0");

    formDatas.append("price_rent", Price1 ? Price1.toString() : "");
    formDatas.append("price_sell", Price2 ? Price2.toString() : "");
  

    if (slug) formDatas.append("slug", slug);


    try {
      const res = await axios.post("/api/updatevideo", formDatas, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        router.push(`/watch/${slug}`)
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    }
    
  }

  const handleCheckboxChange = () => {
    setUpscale((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <>
        <p className="text-2xl font-bold mb-4">อัปโหลดวิดีโอ</p>

        {/* <div className="flex items-center justify-center w-full md:w-1/2 mx-auto">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากแล้ววางลง</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MKV (MAX. 100MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
          </label>
      </div>  */}

        <form className="lg:w-1/2 w-full mx-auto" id="formupload" onSubmit={Uploadvideo}>
        
        {/* <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
        /> */}
        <label className="block">
          <input
            type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-red-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-red-50 file:text-red-700
          hover:file:bg-red-100
        " required/>
        </label>

        <label className="relative inline-flex items-center cursor-pointer mt-5 ml-2">
            <input checked={upscale === 1} onChange={handleCheckboxChange}  type="checkbox" value="0" name="endstatus" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Upscale</span>
        </label>

        <button type="submit" className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full">อัปโหลดวิดีโอ</button>
        </form>

        {progress > 0 && progress < 100 &&(
        <div className="mt-12 lg:w-1/2 w-full mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-red-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress === 100 ? (
            <p className="text-center mt-2 font-bold">กรอกข้อมูลของวิดีโอได้เลยค่ะ</p>
          ) : (
            <p className="text-center mt-2 font-bold">{progress}%</p>
          )}
        </div>
      )}

      <div id="videoarea" className="flex justify-center"></div>

      <form className="lg:w-1/2 w-full mx-auto mt-6 hidden" id="formvideo" onSubmit={UpdateVideo}>
      <p className="text-gray-600 mb-3">ชื่อวิดีโอ</p>
        <input
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />
        <p className="text-gray-600 mb-3">คำอธิบายวิดีโอ</p>
        <textarea
            placeholder="Description"
            onChange={(e) => setdescription(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />
        <p className="text-gray-600 mb-3">ภาพปกวิดีโอ</p>

        <label className="block">
          <input
            type="file" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-red-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-red-50 file:text-red-700
          hover:file:bg-red-100
        " required/>
        </label>
        <p className="text-gray-600 mt-4">สถานะวิดีโอ</p>
        
        <div className="mt-6 mb-2 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="type"
            value={option.value}
            checked={Type === option.value}
            onChange={handleTypeChange}
            className="form-radio"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3 hidden" id="pricegroup">

        <input
            name="Price1"
            type="number"
            placeholder="ราคาเช่า"
            value={Price1 !== null ? Price1 : ""}
            onChange={(e) => setPrice1(parseFloat(e.target.value) || null)}
            className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />

          <input
            name="Price2"
            type="number"
            placeholder="ราคาขาย"
            value={Price2 !== null ? Price2 : ""}
            onChange={(e) => setPrice2(parseFloat(e.target.value) || null)}
            className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />

        </div>

        <button type="submit" className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full">อัปเดตข้อมูล</button>

      </form>

    </>
  );
};

export default UploadForm;