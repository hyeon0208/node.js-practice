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
    sound: 'mung mung',
    happy: true
}

dog.__proto__ = animal;
cat.__proto__ = dog;

console.log(cat.tail); // 1
console.log(cat.leg); // 4
console.log(cat.sound); // yaong
console.log(cat.happy); // true