function fakeSetTimeout(test) {
    test();
}

console.log(0);

fakeSetTimeout(() =>
    console.log("Hello")
);

console.log(2);