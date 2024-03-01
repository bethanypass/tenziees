import React, { useCallback } from 'react';
import './App.css';
import Dice from './components/dice';
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

function App() {
  const [dice, setDiceValues] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollNumber, setRollNumber] = React.useState(0)
  const [bestAttempt, setBestAttempt] = React.useState<number | null>(() => {
    const storedValue = localStorage.getItem("bestAttempt");
    return storedValue ? JSON.parse(storedValue) : null;
  });

  
  React.useEffect(()=>{
    localStorage.setItem("bestAttempt",bestAttempt?JSON.stringify(bestAttempt) : "")
  }, [bestAttempt])

  const newBestAttempt = useCallback(() =>{
    if(bestAttempt == null){
      setBestAttempt(rollNumber)
      
    }
    else if(rollNumber < bestAttempt){
      setBestAttempt(rollNumber)
    }
  },[rollNumber,bestAttempt])

  React.useEffect(()=> {
    const firstValue = dice[0].value;
     let allEqual = true; 
  
    for (let i = 1; i < 10; i++) {
      if (dice[i].value !== firstValue || !dice[i].isHeld) {
        allEqual =  false; 
      }
    }
    setTenzies(allEqual)
    if(allEqual){
      newBestAttempt()
    }
  }, [dice, newBestAttempt])



  function allNewDice() {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push({id: nanoid(), value: getNewValue(), isHeld: false})
    }
    return result;
  }


  
  function getNewValue(){
    return Math.floor(Math.random() * 6) + 1;
  }

  function reroll(){
    setRollNumber(prev => prev + 1)
    const newDiceValues = dice.map((dice) => {
      if (!dice.isHeld) {
        return {...dice, value: getNewValue()};
      }
      return dice;
    });
    setDiceValues(newDiceValues)
  }

  function newGame(){
    setTenzies(false);
    setDiceValues(allNewDice)
    setRollNumber(0)
  }

  function toggleHeld(id: string){
    const newDiceValues = dice.map((dice) => {
      if (dice.id === id) {
        return {...dice, isHeld: !dice.isHeld};
      }
      return dice;
    });
    setDiceValues(newDiceValues)
  }


  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
        {dice.map(dice => <Dice key={dice.id} value= {dice.value} isHeld={dice.isHeld} toggle={()=>toggleHeld(dice.id)}/>)}
      </div>
      <button className="roll-button" onClick={tenzies? newGame : reroll}>{tenzies? "New Game" : "Reroll"}</button>
      <div className='score-container'>
        <p>Rolls: {rollNumber}</p>
        {
          bestAttempt &&
          <p>Best Attempt: {bestAttempt.toString()}</p>
        }
        
      </div>
    </main>
  );
}

export default App;
