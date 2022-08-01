setTimeout(() => {
    setTimeout(() => {
        console.log("Todo: Second work!");
    }, 2000);
    console.log("Todo: First work!");
}, 3000);


// "Todo: First work!"
// "Todo: Second work!"
