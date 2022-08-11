const mongoose = require("mongoose");

// mongoose 연결
mongoose
    .connect("mongodb://127.0.0.1:27017/test", {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

// 스키마 정의
const customerSchema = mongoose.Schema({
    name: 'string',
    age: 'number',
    sex: 'string'
},
    {
        collection: 'newCustomer'
    }
);

// 스키마를 모델로 변환.
const Customer = mongoose.model('Schema', customerSchema);

// 모델로 인스턴스 ( 도큐먼트 ) 생성 
const customer1 = new Customer({ name: '홍길동', age: 30, sex: '남' });

// mongoDB에 데이터 저장
customer1.save()
    .then(() => {
        console.log(customer1);
    })
    .catch((err) => {
        console.log('Error : ' + err);
    });