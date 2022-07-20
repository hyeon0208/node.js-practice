const animal = {
    leg: 4,
    tail: 1,
    say() {
        console.log("I have 4 legs 1 tail")
    }
}

const cat = {
    sound: 'yaong'
}

const dog = {
    sound: 'mung mung'
}

dog.__proto__ = animal;
cat.__proto__ = animal;

console.log(dog.tail);
console.log(dog.leg);
console.log(dog.sound);