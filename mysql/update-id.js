const morgan = require('morgan');
const models = require('./models');
const express = require('express');
const app = express();

// 포트 설정 
app.set('port', process.env.PORT || 8080);

// 미들웨어
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// id 수정
app.put('/customer/:id', async (req, res) => {
    const customer = await models.newCustomer.update({
        where: { id: req.params.id }, // 해당 요청 id 찾기 조건식
        name: body.name,
        age: body.age,
        sex: body.sex,
    });
    return res.json(customer);
});

// id 삭제
app.delete('/customer/:id', async (req, res) => {
    const customer = await models.newCustomer.destroy({
        where: { id: req.params.id },
    });
    return res.json(customer);
});

// 서버와 포트 연결
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});