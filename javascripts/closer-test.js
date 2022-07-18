funtion outer() {
	var a = "A";
	var b = "B";

	funtion inner() {
		var a = "AA";
		var b = "BB";
		console.log(b);
}
return inner;
}

var outerFunc = outer();
outerFunc();