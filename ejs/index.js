const path = require('path');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

// ejs 파일 위치
app.set('views', __dirname + '/views')

// ejs 사용
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        "People":
            [
                {
                    "name": "이동해",
                    "age": "32"
                },
                {
                    "name": "김지수",
                    "age": "23"
                },
                {
                    "name": "이현아",
                    "age": "25"
                },
                {
                    "name": "서지석",
                    "age": "23"
                }

            ]
        , title: "Express"
    });
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});
