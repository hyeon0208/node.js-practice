// 간단한 서버 구축 시 api key 인증을 구현할 수 있는 모듈.

const uuidAPIkey = require('uuid-apikey');

console.log(uuidAPIkey.create()); //api키를 하나 발급해주는 함수.