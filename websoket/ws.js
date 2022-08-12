// 웹소켓 모듈 불러오기
const WebSoket = require('ws')


// 웹소켓 서버 구현
const ws = new WebSoket('ws://www.host.com/path')

ws.on('open', function open() {
    ws.send('something'); // .send() 를 통해 원하는 메세지를 보냄
});

ws.on('message', function incomming(data) {
    console.log(data);
});