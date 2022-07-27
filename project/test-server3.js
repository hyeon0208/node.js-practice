const http = require("http");

http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("Hello")
        res.end()
    } else {
        res.end("err")
    }
})
    .listen(8080, () => {
        console.log("8080포트에서 서벼 연결 중")
    })