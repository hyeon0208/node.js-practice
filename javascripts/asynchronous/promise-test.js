function work(sec) {
    // Promise의 인스턴스를 반환하고, then에서 반환한 것을 받는다.
    return new Promise((resolve, reject) => {
        // Promise 생성시 넘기는 callback = resolve, reject
        // resolve 동작 완료시 호출, 오류가 났을 시 reject
        setTimeout(() => {
            resolve(new Date().toISOString());
        }, sec * 1000);
    });
}

work(1).then((result) => {
    console.log("첫 번째 작업", result);
    return work(1);
}).then((result) => {
    console.log("두 번째 작업", result)
});