// 웹소켓 모듈 불러오기
const WebSoket = require('ws')

module.exports = (server) => {
    const wss = new WebSoket.Server({ server });

    wss.on('connection', (ws, req) => { // 연결 생성
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 요청자의 ip를 알아내는 구문.
        console.log('New Client : ', ip);

    ws.on('message', (message) => { // 클라이언트로부터의 메세지
            console.log(message);
    });

    ws.on('error', (err) => { // 에러 발생 시
        console.error(err);
    });

    ws.on('close', () => { // 종료 시
        console.log('클라이언트 접속 해제', ip);
        clearInterval(ws.interval);
        //  clearInterval(변수) = 반복 중단
    });

    ws.interval = setInterval(() => { // 서버에서 메세지
        //  setInterval(콜백함수, 시간) = 시간(ms)을 간격으로 콜백함수를 반복 시작
        if (ws.readyState === ws.OPEN) { //.OPEN 이 대문자여야함.
            // 비동기처리로 연결되지 않은 상태에서 메세지를 보내는 것을 막기 위해 .readyState 사용
            ws.send('Message From Server');
        }
    }, 3000);  // 클라이언트에게 3초마다 메세지 전송
});
};