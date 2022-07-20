setTimeout(() => console.log("3초후 실행됨"), 3000)

setTimeout(() => console.log("5초후 실행됨"), 5000)

setTimeout(() => console.log("2초후 실행됨"), 2000)

setTimeout(() => {
    console.log("6초후 실행됨");
}, 6000);

// 비동기적으로 순서에 대한 결과를 기다리지 않고 이벤트가 발생하는 순서대로 실행.

// 7행 코드와 나머지 행 코드의 문법은 같다.