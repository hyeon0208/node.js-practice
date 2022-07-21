async function AsyncFunc() {
    return "done";
}

const result = AsyncFunc();
console.log(result);

// 오류가 발생하지 않고 성공해 resolved 프로퍼티가 반환됨
// Promise { 'done' }