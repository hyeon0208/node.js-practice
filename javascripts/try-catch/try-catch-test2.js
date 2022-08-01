function f2() {
    console.log("f2 함수 시작");
    throw new Error("오류 발생");
    console.log("f2 함수 끝");
}

function f1() {
    console.log("f1 함수 시작");
    try {
        f2();
    } catch (e) {
        console.log(e);
    }
    console.log("f1 함수 끝")
}

f1()
