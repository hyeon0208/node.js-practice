async function AsyncFunc() {
    throw "my func Error!";
}

function promiseFunc() {
    return new Promise((resolve, reject) => {
        reject("promise Fuc Error!");
    });
}

const result = AsyncFunc().catch(e => {console.log(e)});
const result2 = promiseFunc().catch(e => {console.log(e)});

