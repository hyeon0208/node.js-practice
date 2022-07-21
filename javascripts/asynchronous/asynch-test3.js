function work(sec, callback) {
     setTimeout(() => {
    callback(new Date().toISOString())
}, sec * 1000)
}

work(1, (result) => {
    console.log("첫 번째 작업", result);
    })

work(1, (result) => {
    console.log("두 번째 작업", result);
}) 

work(1, (result) => {
    console.log("세 번째 작업", result);
})

/* 비동기 처리시
같은 1초로 설정했음에도.
첫 번째 작업 2022-07-20T06:32:57.164Z
두 번째 작업 2022-07-20T06:32:57.167Z
세 번째 작업 2022-07-20T06:32:57.167Z
로 모든 같은 시간에 끝난다. 
*/