var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var queryString = require("querystring");
//var index = require("./index");

var count = 0;

// 创建服务器
http.createServer( function (request, response) { 
  //当请求为post的时候
  if(request.method == "POST") {
   	var Post = "";
    request.on("data", function(chunk) {
    	Post += chunk;
    });
    	
    request.on("end", function() {
    	if(Post.substring(0, 6) == "addend" && count < 5) {
        var num = Math.ceil(Math.random()*9) + 1;
        console.log(num);
        if(count == 0) response.end(num.toString());
        else response.end(Post.substring(6) + "+" + num.toString());
        count++;
      }  
      else if(Post.substring(0, 9) == "calculate") {
        Post = Post.substring(9, Post.length);
        console.log(Post);
        if(Post.indexOf("=") == -1) response.end(eval(Post).toString());
        else response.end("");
      } 
      else if(Post.substring(0, 5) == "clear") {
        count = 0;
        fs.writeFile('data.txt',Post.substring(5)+"\r\n", { flag: 'a'}, (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        });   
        response.end();
      }
      else if(Post == "show") {
        fs.readFile("data.txt", function(err, buffer) {
          if (err) throw err;
          response.end(buffer.toString("utf-8"));
        });
      }  
      else if(Post.substring(0, 6) == "search") {
        
        fs.readFile("data.txt", function(err, buffer) {
          if (err) throw err;
          
          var str = buffer.toString("utf-8");
          var start = 0, flag = false;
          for(var i = 0; i < str.length; i++) {
            if(str[i] == "\n") {
              if(str.substring(start, i) == Post.substring(6) + "\r") {
                response.end("We had this expression");
                flag = true;
                break;
              }
              start = i + 1;
            }
          }
          if(flag == false) response.end("We did not have this expression");
        });
      }
      else if(Post == "clean") {
        fs.writeFile('data.txt', "", (err) => {
          if (err) throw err;
          console.log('It\'s cleand!');
        });   
        response.end();     
      }


    });	 	
  }
  else if(request.method == "GET") {
   	// 解析请求，包括文件名
   	var pathname = url.parse(request.url).pathname;
   // 输出请求的文件名
   	console.log("Request for " + pathname + " received." + "url" + request.url);
    
    if(request.url == "/" || request.url.substring(0, 11) == "/?username=") {
 			response.writeHead(200, {'Content-Type': 'text/html'});
   	 	response.write(fs.readFileSync('index.html','utf-8'));
   	 	response.end();
   	}
   	else {
   		// 从文件系统中读取请求的文件内容
   		fs.readFile(pathname.substr(1), function (err, data) {
   	    var type = path.extname(pathname).substring(1);
        if (err) {
          console.log(err);
         	// HTTP 状态码: 404 : NOT FOUND
         	// Content Type: text/plain
         	response.writeHead(404, {'Content-Type': 'text/' + type});
      	}
        else {	         
         	// HTTP 状态码: 200 : OK
         	// Content Type: text/plain
         	response.writeHead(200, {'Content-Type': 'text/' + type});	
         	// 响应文件内容
         	response.write(data);		
      	}
      	//  发送响应数据
      	response.end();
   			});    	
   	}   		
  }
}).listen(8000);

// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:8000/');
