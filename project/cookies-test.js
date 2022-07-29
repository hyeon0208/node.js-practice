const http = require("http");

http.createServer((req, res) => {
    res.writeHead(200, {"Set-Cookie": "name=shj"});
    console.log(req.headers.cookies);
    res.end("Cookies --> Header");
})
    .listen(8080, () => {
        console.log("8080포트에서 서버 연결 중...")
    });
