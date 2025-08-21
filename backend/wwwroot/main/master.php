<?php

    header('Access-Control-Allow-Origin: *');

    
    header("X-Robots-Tag: noindex,nofollow,noarchive,nosnippet,noydir,noodp");
    header("Expires: Sun, 01 Jan 2014 00:00:00 GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", FALSE);
    header("Pragma: no-cache");
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
    

    
    $allowedReferer = "localhost";
        
    if (isset($_GET['key'])) {
        
        if (isset($_GET['key']) && !empty($_GET['key'])) {
            
            if (strpos($_SERVER["REQUEST_URI"], "?ts=20") !== false) {
                
                $cuts = explode( "/", $_SERVER["REQUEST_URI"]);
                $count = substr_count($_SERVER["REQUEST_URI"], "/");
                
                if ($count > 2) {
                    $decodes = base64_decode($cuts[3]);
                } else {
                    $decodes = base64_decode($_GET['key']);
                }
                $decode = d2($decodes);
                
                
                $cut = explode("~", $decode);
                $filename = $cut[1];
                
                if (file_exists($filename)) {
                    
                    
                    $cutz = "/files/" . substr($filename, 5);
                    
                    header('Content-Type: image/jpg');
                    header('X-Accel-Redirect: '. $cutz .'');
                    
                    //readfile($filename);
                    
                    
                } else {
                    
                    echo "YOU'RE UGLY!";
                    
                }
                
            } else if (strpos($_SERVER["REQUEST_URI"], "?tc=1") !== false) {
                
                $decode = d2(base64_decode($_GET['key']));
                $cut = explode("~", $decode);
                $filename = $cut[1];
                
                if (file_exists($filename)) {
                    
                    $content = file_get_contents($filename);
                    $foldername = explode("/", $cut[1]);
                        
                    if (strpos($content, '#EXT-X-ENDLIST') !== false) {
                        $content = explode("\n", $content);
                        foreach ($content as $k => $v) {
                            if (strpos($v, '.jpg') !== false) {
                                $v = base64_encode(e(time() . '~' . "temp/" . $foldername[1] . '/' . substr($foldername[2], 0, -5) . '/' . $v)) . '?ts=20';
                            }
                            $content[$k] = $v;
                        }
                        echo implode("\n", $content);

                    } else {
                        echo $content;
                    }

                }

            } else {
            
                $key = d($_GET['key']);   
                
                if (preg_match('/iphone|ipod|ipad|mac/', strtolower($_SERVER['HTTP_USER_AGENT']))) {
                        header("Content-Type: application/x-mpegURL", true);
                } else {
                    header("Content-Type: text/plain", true);
                }
                     
                $cut = explode("~", $key);
                $cut2 = explode(":", $cut[1]);
            
                $masterfile = "temp/" . $cut2[1] . "/". $cut2[1] .".m3u8";
                    
                if (file_exists($masterfile)) {
                    
                    $content = file_get_contents($masterfile);
                        
                    if (strpos($content, '#EXT-X-ENDLIST') !== false) {
                        $content = explode("\n", $content);
                        foreach ($content as $k => $v) {
                            if (strpos($v, '.jpg') !== false) {
                                $v = base64_encode(e(time() . '~' . "temp/" . $cut2[1] . '/' . $v)) . '?ts=20';
                            }
                            $content[$k] = $v;
                        }
                        echo implode("\n", $content);

                    } else if (strpos($content, '#EXT-X-STREAM') !== false) {
                        $content = explode("\n", $content);
                        foreach ($content as $k => $v) {
                            if (strpos($v, '.m3u8') !== false) {
                                $v = base64_encode(e(time() . '~' . "temp/" . $cut2[1] . $v)) . '?tc=1';
                            }
                            $content[$k] = $v;
                        }
                        echo implode("\n", $content);
                    } else {
                        echo $content;
                    }
                       
                
                } else {
                    
                    echo $masterfile;
                    
                }
            
            }
            
        } else {
            
            
            echo 'header no detect';
        }
        
    } else {
        
        echo 'ESAN DETECTED!';
        
    }
?>