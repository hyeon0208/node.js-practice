const http = require('http');
const express = require('express');
const app = express();

app.use(express.static(__dirname)); 

const server = http.Server(app);

// http server를 socket.io server로 upgrade한다
const io = require('socket.io')(server);

let users = [];

server.listen(8080, () => {
    console.log("8080 포트에서 서버 실행 중");
});

// localhost:8080으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// connection event handler
// connection이 수립되면 event handler function의 인자로 socket이 들어온다
io.on('connection', (socket) => {
    let name = '';

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('has connected', (username) => {

        // socket에 users리스트에 사용자를 넣고,
        name = username;
        users.push(username);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit("has connectecd", {
            username: username,
            usersList: users
        });
    })

    // 클라이언트로부터의 has disconnected 이벤트 메시지가 수신되면
socket.on('has disconnected', () => {
    // splice 함수를 통해 사용자를 제거한다.
    users.splice(users.indexOf(name), 1);

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    io.emit('has disconnected', { 
        username: username,
        usersList: users
    })
})

// 클라이언트로 부터 new message 이벤트가 수신되면
socket.on('new message', (data) => {
    // 모든 소켓에 메세지를 보냄
    io.emit('new message', data);
});

});