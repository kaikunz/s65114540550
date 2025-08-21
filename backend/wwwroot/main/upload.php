<?php

  
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Content-Length,Authorization");
// header("Access-Control-Allow-Credentials: true");

    define('KB', 1024);
    define('MB', 1048576);
    define('GB', 1073741824);
    define('TB', 1099511627776);
    date_default_timezone_set("Asia/Bangkok");
    error_reporting(E_ERROR | E_PARSE);
    
    function generateRandomString($length = 7)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0;$i < $length;$i++)
        {
            $randomString .= $characters[rand(0, $charactersLength - 1) ];
        }
        return $randomString;
    
    }
    
    require_once 'vendor/autoload.php';

    
    
    if (isset($_FILES['file']) && isset($_POST['path']) && isset($_POST['slug'])) {
        
        $ran = $_POST['path'];
        
        $slug = $_POST['slug'];
        
        
        $dir = "temp/$ran/";
        
        $getID3 = new getID3;
        $fileInfo = $getID3->analyze($_FILES['file']['tmp_name']);
        $file_name = $_FILES['file']['name'];
        
        
        if (!file_exists($dir)) {
                            
            mkdir($dir, 0755, true);
                            
        }
        
        $redis = new Predis\Client([
            'scheme' => 'tcp',
            'host'   => 'redis', // ถ้า docker ให้ใส่เป็น redis ถ้าไม่ ใส่ 127.0.0.1 หรือใส่เป็น default ของมันนะ
            'port'   => 6379
        ]);
        
        $unique = uniqid();
        $original = $ran . "_" . basename($file_name);
        $filenames = $ran . "_" . $file_name;
        
        $temp_file_location = $_FILES['file']['tmp_name'];
        $destination = $dir . $original;
        
        if (move_uploaded_file($temp_file_location, $destination)) {
            
            $redis->lpush("video_processing_queue", json_encode([
                "path" => $ran,
                "slug" => $slug,
                "file_path" => $destination,
                "dir" => $dir,
                "type" => $_FILES['file']['type'],
                "upscale" => $_POST['upscale'],
                "filename" => $filenames,
                
            ]));
            
            echo json_encode(array("status" => "Queue"));
            
        } else {
            echo json_encode(array("status" => "Error Save file"));
        }


        
        
        $realurl = 'https://chickeam.com/play?test=https://chickeam.com/'. $dir .'playlist.m3u8';
        
        
        
        
    } else {
        
        echo 'no';
    }
    
    
?>