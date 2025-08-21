const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        cors: { origin: "*" },
        path: "/connectwebsocket",
    });
    

    const chatRooms = new Map(); 

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("create-liveroom", ({ liveId, host }) => {
          if (chatRooms.has(liveId)) {
              socket.emit("error", "ห้องนี้ถูกสร้างแล้ว");
              return;
          }
          chatRooms.set(liveId, { users: [], messages: [], host });
          console.log(`Live Room Created: ${liveId} by ${host.name}`);
  
          io.emit("room-created", { liveId, host });
      });

      socket.on("join-room", ({ liveId, user }) => {
        if (!chatRooms.has(liveId)) {
            socket.emit("error", "ห้องนี้ยังไม่ได้ถูกสร้าง");
            
            return;
        }
            
        if (socket.rooms.has(liveId)) {
            console.log(`⚠️ ${user.name} พยายามเข้าห้อง ${liveId} ซ้ำ`);
            socket.emit("error", "คุณอยู่ในห้องนี้แล้ว");
            return;
        }
    
        socket.join(liveId);
        const room = chatRooms.get(liveId);

        io.to(liveId).emit("user-count", { liveId, count: io.sockets.adapter.rooms.get(liveId)?.size || 0 });
        
        if (!room.users.some((u) => u.id === user.id)) {
            room.users.push(user);
        }
        console.log(`${user.name} joined room: ${liveId}`);

        io.to(liveId).emit("update-users", room.users);

        socket.emit("chat-history", room.messages);
      });

      socket.on("send-message", ({ liveId, user, message }) => {
          if (!chatRooms.has(liveId)) return;
          
          const chatMessage = {
              user,
              message,
              timestamp: new Date().toISOString(),
          };

          chatRooms.get(liveId).messages.push(chatMessage);

          io.to(liveId).emit("receive-message", chatMessage);
      });


        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> WebSocket Server Ready on http://202.28.49.122:3000/connectwebsocket");
    });
});
