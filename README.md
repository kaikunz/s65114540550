# Chickeam Streaming Platform

สิ่งที่จำเป็นสำหรับการรัน (Requirement)
- Docker

## Port ที่ต้องใช้
```
NEXTJS
10550 (3000) - port app
20550 (5432) - port PostgreSQL

NGINX PHP Redis (Backend) (ถ้าไม่รันส่วน Nginx Reverse Proxy ให้ข้ามส่วน Backend เลยนะครับ)
30550 (6379) - port redis
40550 (1953) - port rtmp_nginx
50550 (80) - port PHP hls streaming host
60550 (5000) - port player host
```

## STEP 1 
- หลังจาก Clone เสร็จสามารถพิมพ์คำสั่ง Docker ในส่วน Frontend เพื่อรันได้เลย
```
docker compose up -d --build
```

## STEP 2 
- หลังจากนั้นให้พิมพ์คำสั่ง Docker ในส่วน Backend ซึ่งต้องเข้าไปยัง Path ของ Backend ก่อน
```
cd backend
docker compose up -d --build
```

## พร้อม
```
http://localhost:10550
```
