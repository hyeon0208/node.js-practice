
const express = require('express');
const app = express();

app.get('/', function (req, res, next) {
    res.send('Hello World!');
    next(); //  res.send 에서 응답을 종료해버리기 때문에 next로 흐름이 넘어가도록 해줘야함.
});

const myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
};

app.use(myLogger);

app.listen(8080);  