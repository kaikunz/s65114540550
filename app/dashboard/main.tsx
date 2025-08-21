"use client";

import axios from "axios";

export default function Main({ user }: { user: any }) {

    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">ผู้ติดตามทั้งหมด</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">0</p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">ชั่วโมงในการรับชม</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">0</p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg py-12">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold">รายได้ของฉัน</p>
                </div>
                <div className="flex justify-center mt-4">
                <p className="text-7xl font-bold">0</p>
                </div>
            </div>

        </div>
        </>
    )

}