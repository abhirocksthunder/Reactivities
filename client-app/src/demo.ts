export interface Duck {
    name: string;
    numOfLegs: number;
    makeSound:(sound: string) => void;
}

const duck1: Duck = {
    name: 'bow',
    numOfLegs:2,
    makeSound:((sound: any)=> console.log(sound))
}

const duck2: Duck ={
    name: 'chow',
    numOfLegs:4,
    makeSound: (sound: any)=> console.log(sound)
}

duck1.makeSound('quack');
duck2.makeSound('quack');

export const ducks = [duck1, duck2];