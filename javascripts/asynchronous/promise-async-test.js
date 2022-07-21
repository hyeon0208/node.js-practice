function workP(sec) {
    return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(new Date().toISOString());
            }, sec * 1000)
    });
}

function justFunc() {
    return "Just Function";
}

async function asyncFunc() {
    return "async Function";
}

console.log(justFunc());
console.log(asyncFunc());
console.log(workP());