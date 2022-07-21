function work(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(new Date().toISOString());
        });
    });
}

work(1).then((result) => {
    console.log('첫번째 작업', result);
    return work(1);
}).then((result) => {
    console.log('두번째 작업', result);
});