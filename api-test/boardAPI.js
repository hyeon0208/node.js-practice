const morgan = require('morgan');

/* express app generate */
const express = require('express');
const app = express();

/* 포트 설정 */
app.set('port', process.env.PORT || 8080);

/* 공통 미들웨어 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 테스트를 위한 게시글 데이터 */
let boardList = []; // 데이터를 boardList 에 리스트 형태로 저장.
let numOfBoard = 0; // 게시글이 하나씩 추가될 때마다 늘어날 index를 위한 변수.

/* 라우팅 설정 */
app.get('/', (req, res) => {
    res.send('This is api.js');
});

/* 게시글 API */
app.get('/board', (req, res) => {
    res.send(boardList);
});

app.post('/board', (req, res) => {
    const board = { // board 객체에 요청 바디로 부터 받은 값을 저장.
        "id": ++numOfBoard,
        "user_id": req.body.user_id,
        "date": new Date(),
        "title": req.body.title,
        "content": req.body.content
    };
    boardList.push(board); // board 객체를 boardList에 push

    res.redirect('/board');
});

app.put('/board/:id', (req, res) => {
    // req.params.id 값 찾아 변환
    const findItem = boardList.find((item) => {
        return item.id == +req.params.id
    });

    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    // 리스트에 새로운 요소 추가
    const board = {
        "id": +req.params.id,
        "user_id": req.params.user_id,
        "date": new Date(),
        "title": req.body.title,
        "content": req.body.content
    };
    boardList.push(board);

    res.redirect('/board');
});

app.delete('/board/:id', (req, res) => {
    // req.params.id 값 찾아 리스트에서 삭제
    const findItem = boardList.find((item) => {
        return item.id == +req.params.id
    });
    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    res.redirect('/board');
});

/* 서버와 포트 연결.. */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});

//localhost:8080/board/3CCHAAM-C0ZMC86-QB498ZA-QRDE88V/search?keyword=호호