
<html>
    
    <head>
        <title>CHICKEAM PLAYER</title>
        <style>
            
            html,body{padding:0;margin:0;height:100%}
#player{width:100%;height:100%;overflow:hidden;background-color:#000}
            
            
        </style>
        
    </head>
    
    <body>
        
        
        <script src="https://ssl.p.jwpcdn.com/player/v/8.22.0/jwplayer.js"></script>
        <div id="player"></div>
        
    
        <script>
        //ffmpeg -i dora2024.mkv -codec: copy -bsf:v h264_mp4toannexb -start_number 0  -hls_time 3 -hls_list_size 0  -f hls -hls_segment_filename temp/doraemon2024/d_%03d.jpg temp/doraemon2024/playlist.m3u8
          var jwp = jwplayer('player');
jwp.setup({
    width: "100%",
    height: "100%",
    key: "cLGMn8T20tGvW+0eXPhq4NNmLB57TrscPjd1IyJF84o=",
    playlist: [{
        file: "http://localhost:5000/watch/<?php echo $_GET['key'] ?>",
        type: "hls", 
        label: "HLS"
    }],
    primary: "html5",
    crossdomain: true,
    withCredentials: true
});

        </script>
        
    </body>
    
    
</html>