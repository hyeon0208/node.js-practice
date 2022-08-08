const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => { // html 데이터를 먼저 가져오기위해 async/await 사용.
    try {
        return await axios.get("https://roadbook.co.kr/category/%EC%8B%A0%EA%B0%84%EC%86%8C%EA%B0%9C");
    } catch (error) {
        console.error(error);
    }
};

getHtml()
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data); // 받은 html 데이터를 cheerio 객체로 변환.
        const $bodyList = $("div#searchList ol").children("li"); //갖고자하는 부분을 변수에 할당.

        $bodyList.each(function (i, elem) { // each는 배열을 순회하며 callnack 함수를 실행하는 함수.
            ulList[i] = {
                bookList: $(this).find('a').text(), //<a> 태그 안의 텍스트만 뽑는다.
                url: $(this).find('a').attr('href'), // attr()는 해당 속성 안에 들어있는 텍스트를 뽑는다.
            };
        });

        const data = ulList.filter(n => n.bookList);
        return data;
    })
    .then(res => console.log(res));  