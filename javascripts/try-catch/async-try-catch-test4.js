
async function AsyncFunc() {
    consolefaef.log(new Date()); // Uncaught
    const result = await wait(2).catch(e => {
        console.error(e)
    });
    console.log(new Date());
}

// try { 
//     AsyncFunc(); }
// catch (e) { } // try/catch는 반환하는 promise에 대한 오류만 잡는다.

AsyncFunc().catch(e); // 구문의 오류를 찾기 위해선 .catch를 이용해야함 