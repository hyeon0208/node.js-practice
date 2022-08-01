function work(sec, callback) {
    setTimeout(() => {
   callback(new Date().toISOString())
}, sec * 1000)
}

work(1, (result) => {
   console.log("첫 번째 작업", result);

        work(1, (result) => {

            work(1, (result) => {
            console.log("세 번째 작업", result);
            })

            console.log("두 번째 작업", result)
        })
});

/* 동기 처리시
콜백함수안에 콜백 함수를 넣으면 
첫 번째 작업 2022-07-20T06:40:04.427Z
두 번째 작업 2022-07-20T06:40:05.431Z
세 번째 작업 2022-07-20T06:40:06.432Z
로 순차적으로 처리된다.
*/