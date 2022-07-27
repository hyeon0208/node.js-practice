const http = require('http');

http.createrServer((req, res) => {
    res.writeHead(200, { "content-Type": "test/html; charset=utf-8" });
    res.write( "<h1>Node.js로 서버 만들기</h1>");
    res.end("<p>http모듈 공부 중...</p>")
})

    .listen(8080, () => {
        console.log("8080포트에서 서버 연결 중...")
    });



