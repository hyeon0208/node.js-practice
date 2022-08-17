const path = require('path');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views')
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
                    "name": "박현아",
                    "age": "29"
                },
                 "name": "박현아",
                    "age": "29"
                }
            ]
        , title: "Express"
    });
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});
