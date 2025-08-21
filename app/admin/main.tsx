"use client";

import axios from "axios";
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';


export default function Main({ user }: { user: any }) {

    const [usercount, setusercount] = useState<number | null>(null);
    const [reportcount, setreportcount] = useState<number | null>(null);

    const FetchAdminDetail = async () => {
        try {
          const response = await axios.post("/api/admin/");
          setusercount(response.data.usercount);
          setreportcount(response.data.reportCount);

        } catch (error) {
          console.error("Failed to fetch video detail:", error);
        }
      };
      useEffect(() => {
        FetchAdminDetail();
      })
      

    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">จำนวนผู้ใช้ทั้งหมด</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">{usercount}</p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">จำนวนการรายงาน</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">{reportcount}</p>
                </div>
            </div>


        </div>
        </>
    )

}