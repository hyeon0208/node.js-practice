function Animal() { };

Animal.prototype.legs = 4;
Animal.prototype.tail = 1;

const dog = new Animal();
const cat = new Animal();

console.log(dog.legs);
console.log(cat.legs);
console.log(dog.tail);
