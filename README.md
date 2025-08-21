# Chickeam Streaming Platform

สิ่งที่จำเป็นสำหรับการรัน (Requirement)
- Docker

  

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
http://localhost:3000
```