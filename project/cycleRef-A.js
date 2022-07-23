const A = 'variable A from cycleRef-A';
const B = require('./cycleRef-B');

console.log(B + " in cycleRef-A");

module.exports = A;