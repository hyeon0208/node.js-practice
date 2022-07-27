const http = require("http");
const fs = require("fs").promises;

http.createServer(async (req,res) => {
    try {
        const f = await fs.readFile('./fs-test.html');
        res.writeHead(200, { "content-Type": "text.html; charset=utf-8" });
        // 200이면 요청 성공
        res.end(f); // 요청 종료
    } catch (e) { //오류처리
        console.error(e); // 요청 실패시 오류 출력
        res.writeHead(500, { "content-Type": "text.html; charset=utf-8" });
        // 500이면 서버 오류 발생
        res.end(e.message); // 오류 메세지와 함꼐 요청 종료
    }
})
    .listen(8080, () => {
        console.log("8080포트에서 서버 연결 중...")
    });