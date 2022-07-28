const express = require('express');
const app = express();

app.use((err, req, res, next) => { // 오류 처리 미들웨어
    console.error(err.stack);
    res.status(500).send("Something broke");
});


app.listen(3000);