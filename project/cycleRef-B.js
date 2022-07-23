const A = require('./cycleRef-A');
const B = 'variable A from cycleRef-B';

console.log(A + " in cycleRef-B");

module.exports = B;