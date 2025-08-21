<?php
 header('Access-Control-Allow-Origin: *');
 header('Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Content-Length');
 header("Accept-Encoding: gzip, deflate");

    define('_SEC_LOCK', '#$wel');
    
    
    function d($str) {
        $str = str_replace(['-', '_'], ['+', '/'], $str);
        $str = str_pad($str, strlen($str) % 4, '=', STR_PAD_RIGHT);
    
        $dec = base64_decode($str);
        return openssl_decrypt($dec, "AES-128-ECB", str_pad(_SEC_LOCK, 16, " "), OPENSSL_RAW_DATA);
    }
    
    function d2($str) {
        $dec = base64_decode($str);
        return openssl_decrypt($dec, "AES-128-ECB", _SEC_LOCK);
    }
            
    function e($str) {
        $enc = openssl_encrypt($str, "AES-128-ECB", _SEC_LOCK);
        return base64_encode($enc);
    }


    if (isset($_POST['name'])) {
        
        $key = d($_POST['name']);   
        $cut = explode("~", $key);
        
        if ($cut[1]) {
            
            http_response_code(200);
            echo "OK";
            
        } else {
            
            http_response_code(403);
            echo "Forbidden";
            
        }
        
        
    } else {
        
        http_response_code(403);
        echo "Forbidden";
        
    }


?>