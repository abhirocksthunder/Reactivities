import React from "react";
import { Duck } from './demo';

interface Props{
    duck: Duck;
}

export default function DuckItem(props: Props) {
    let duck = props.duck;
    return (
    <div >
        <span>{duck.name}</span>
        <button onClick={() => duck.makeSound(duck.name + ' quack')}>Make Sound</button>
    </div>
    )
}