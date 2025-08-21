"use client";

import axios from "axios";
import {useRef, useEffect, useState } from "react";
import Link from 'next/link';
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface DetailProps {
  user: User | any;
}



const formatDate = (dateString: string) => {
  return format(new Date(dateString), "d MMMM yyyy", { locale: th });
};


export default function HistoryPage({ user }: DetailProps) {
  
  interface Purchase {
    id: string;
    userId: string; 
    videoId: string; 
    type: 1 | 2;
    expire_date: string | null; 
    createdAt: string; 
    updatedAt: string; 
    video: {
      id: string;
      title: string;
      thumbnail: string;
      price_sell?: number; 
      price_rent?: number;
      slug: string;
    };
  }
  
  
  const [purchasesBuy, setPurchasesBuy] = useState<Purchase[]>([]);
  const [purchasesRent, setPurchasesRent] = useState<Purchase[]>([]);
  
  const [pageBuy, setPageBuy] = useState(1);
  const [pageRent, setPageRent] = useState(1);
  const [hasMoreBuy, setHasMoreBuy] = useState(true);
  const [hasMoreRent, setHasMoreRent] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFetching = useRef(false);

  const fetchPurchases = async () => {
    if (loading || isFetching.current) return;
    
    isFetching.current = true; 
    setLoading(true);

    try {
      const res = await axios.post("/api/getpurchasehistory", {
        pageBuy: pageBuy,
        pageRent: pageRent,
        pageSize: 5,
      });

        setPurchasesBuy((prev) => [...prev, ...res.data.purchasesBuy]);
        setHasMoreBuy(res.data.hasMoreBuy);
        setPageBuy((prev) => prev + 1); 

        setPurchasesRent((prev) => [...prev, ...res.data.purchasesRent]);
        setHasMoreRent(res.data.hasMoreRent);
        setPageRent((prev) => prev + 1); 
      

      
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      isFetching.current = false; 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(); 
    fetchPurchases();
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mt-4">📦 รายการซื้อ</h2>
      <ul>
      {purchasesBuy.length > 0 ? (
          purchasesBuy.map((purchase) => (
            <li key={purchase.id} className="p-4 border-b flex">
              <img src={purchase.video.thumbnail} alt={purchase.video.title} className="rounded-lg w-24 h-24 object-cover mr-4" />
              <div>
                <p className="font-semibold">{purchase.video.title}</p>
                <p className="text-gray-500">เช่าในราคา: ฿{purchase.video.price_rent}</p>
                <p className="text-gray-500">หมดอายุ: {purchase.expire_date ? formatDate(purchase.expire_date) : "ไม่มีวันหมดอายุ"}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 my-2">ยังไม่มีรายการซื้อค่ะ</p>
        )}
      </ul>
      {hasMoreBuy && (
        <button
          onClick={() => fetchPurchases()}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 font-bold text-2xl"
        >
          แสดงรายการเพิ่มเติม
        </button>
      )}

      <h2 className="text-xl font-bold mt-6">🎬 รายการเช่า</h2>
      <ul>
      {purchasesRent.length > 0 ? (
          purchasesRent.map((purchase) => (
            <Link href={`/watch/${purchase.video.slug}`}>
            <li key={purchase.id} className="p-4 border-b flex">
              <img src={purchase.video.thumbnail} alt={purchase.video.title} className="rounded-lg w-24 h-24 object-cover mr-4" />
              <div>
                <p className="font-semibold">{purchase.video.title}</p>
                <p className="text-gray-500">เช่าในราคา: ฿{purchase.video.price_rent}</p>
                <p className="text-gray-500">หมดอายุ: {purchase.expire_date ? formatDate(purchase.expire_date) : "ไม่มีวันหมดอายุ"}
                </p>
              </div>
            </li>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 my-2">ยังไม่มีรายการเช่าค่ะ</p>
        )}

      </ul>
      {hasMoreRent && (
        <button
          onClick={() => fetchPurchases()}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 font-bold text-2xl"
        >
          แสดงรายการเพิ่มเติม
        </button>
      )}
    </>
  );
}