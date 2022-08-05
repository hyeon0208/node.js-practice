
const morgan = require('morgan');
const url = require('url');
const uuidAPIkey = require('uuid-apikey');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

//포트 설정
app.set('port', process.env.PORT || 8080);

//미들웨어 사용
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 테스트를 위한 api키
const key = {
    apiKey: process.env.apiKey,
    uuid: process.env.uuid
};

// 테스트 게시글 데이터
let boardList = [];
let numOfBoard = 0;

//라우팅 설정
app.get('/', (req, res) => {
    res.send('This is api.js');
});

//게시글 API
app.get('/board', (req, res) => {
    res.send(boardList);
});

app.post('/board', (req, res) => {
    const board = {
        "id": ++numOfBoard,
        "user_id": req.body.user_id,
        "date": new Date(),
        "title": req.body.title,
        "content": req.body.content
    };
    boardList.push(board);

    res.redirect('/board');
});

app.put('/board/:id', (req, res) => {
    // req.params.id 값 찾아 리스트에서 삭제
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

// 게시글 검색 API using uuid-key
app.get('/board/:apikey/:type', (req, res) => {
    let { type, apikey } = req.params;
    const queryData = url.parse(req.url, true).query;

    if (uuidAPIkey.isAPIKey(apikey) && uuidAPIkey.check(apikey, key.uuid)) { //.isAPIKey 와 .check 는 uuid-apikey 의 함수.
        // .isAPIkey(apikey)는 들어온 apikey가 서버에 발급한 적이 있는 키인지 확인
        // .check(apikey, key.uuid)는 eky와 uuid가 짝이 맞는지 확인. (둘중 하나라도 false면 "wrong API Key 응답")
        if (type === 'search') { // type search 일 시 키워드로 게시글 검색  
            const keyword = queryData.keyword;
            const result = boardList.filter((e) => {
                return e.title.includes(keyword)
            })
            res.send(result);
        }
        else if (type === 'user') { // type user 일 시 닉네임으로 게시글 검색  
            const user_id = queryData.user_id;
            const result = boardList.filter((e) => {
                return e.user_id === user_id;
            });
            res.send(result);
        }
        else {
            res.send('Wrong URL')
        }
    } else {
        res.send('Wrong API Key');
    }
});

// 서버와 포트 연결
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});