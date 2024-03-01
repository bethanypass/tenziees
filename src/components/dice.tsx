import React from "react";
import './dice.css';

export default function Dice({value, isHeld, toggle} : {value: number, isHeld: boolean, toggle: () => void}){
    const diceClass = isHeld?"dice-held":"dice"
    return(
        <button className={diceClass} onClick={toggle}>
            <h2 className="die-num">{value}</h2>
        </button>
    )
}