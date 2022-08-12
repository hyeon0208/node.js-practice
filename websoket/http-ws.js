// http 프로토콜과 포트를 공유하는 ws 서버

const WebSoket = require('ws')

const wss = new WebSoket.Server({port: 8080});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Something');
})