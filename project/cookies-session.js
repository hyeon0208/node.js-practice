const http = require('http');

const session = {};
const sessKey = new Date();
session[sessKey] = { name: "shj" };

http.createServer((req, res) => {
    res.writeHead(200, { "Set-cookies": `session=${sessKey}`});
    res.end("Session-Cookies --> Header");
})
    .listen(8080, () => {
        console.log("8080포트에서 서버 실행 중 ...")
    })