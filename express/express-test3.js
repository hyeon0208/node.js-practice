const express = require("express");
const app = express()

app.get('/', (req, res) => {
    res.send("Hello world");
});

const myLogger = (req, res) => {
    console.log("LOGGED");
};

app.use(myLogger);

app.listen(8080, () => {
    console.log("8080 포트에서 서버 연결 중")
});