"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { path: "/connectwebsocket" });

export default function LiveChat({ liveId, user }: { liveId: string; user: { id: string; name: string; image: string } }) {
    const [messages, setMessages] = useState<
        { user: { id: string; name: string; image: string }; message: string; timestamp: string }[]
    >([]);
    const [users, setUsers] = useState<{ id: string; name: string; image: string }[]>([]);
    
    const [input, setInput] = useState("");
    const [usercount, setUserCount] = useState(0);

    useEffect(() => {
        
    
        socket.emit("join-room", { liveId, user });
    
        socket.on("update-users", (usersList) => {
            console.log("👥 Users in room:", usersList);
            setUsers(usersList);
        });
    
        socket.on("chat-history", (history) => {
            console.log("📜 Chat History:", history);
            setMessages(history);
        });

        socket.on("user-count", ({ count }) => {
            console.log(`👥 Users in room: ${count}`);
            setUserCount(count);
        });
    
        socket.on("receive-message", (msg) => {
            console.log("💬 New Message:", msg);
            setMessages((prev) => [...prev, msg]);
        });
    
        return () => {
            socket.off("update-users");
            socket.off("chat-history");
            socket.off("receive-message");
        };
    }, [liveId, user]);
    

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit("send-message", { liveId, user, message: input });
            setInput("");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 border rounded-lg">
            <h2 className="text-lg font-bold text-center mb-2">แชทสด</h2>
            <p className="text-center">กำลังรับชม {usercount} คน</p>

            <div className="h-96 overflow-y-auto border-b mb-7 space-y-2 p-2">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start space-x-2 py-2">
                        <img src={msg.user.image ? msg.user.image : "/images/default.png"} alt={msg.user.name} className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-bold">
                                {msg.user.name} <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </p>
                            <p className="text-sm">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    className="border p-2 flex-grow"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="พิมพ์ข้อความที่นี่..."
                />
                <button className="bg-red-500 hover:bg-red-600 font-bold rounded text-white p-2 ml-2" onClick={sendMessage}>
                    ส่ง
                </button>
            </div>
        </div>
    );
}
