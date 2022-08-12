const SocketIO = require("socket.io");
const socket = require("../socket");

module.exports = (server) => {
    const io = SocketIO(server, { path: "/socket.io"}); // index.html 파일 경로와 동일해야한다.

    io.on('connection', (socket) => { // 연결 생성
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 요청자의 ip를 알아내는 구문.
        console.log(`New Client : ${ip}, socket.id : ${socket.id}`);
    
    // 이벤트 감지
    socket.on('disconnect', () => { //
        console.log(`Client Out: ${ip}, socket.id : ${socket.id}`);
        clearInterval(socket.interval);
    });

    socket.on("error", (error) => {  });

    socket.on("from client", (data) => { // 클라이언트로 부터 받은 데이터
        console.log(data);
    });

    socket.interval = setInterval(() => {
        // socket.io 에선 send() 대신 emit() 을 사용
        // io.emit 은 연결 된 모든 socket에 이벤트 전송
        // socket.emit 은 특정 소켓에게만 이벤트 전송.
        socket.emit("from server", "Message From server"); // .emit( 이벤트명, 메세지 )
    }, 3000);
});
}