import { useState } from 'react';

/**
 * 
 * @param initial 
 * A custom hook that allows the user to transition between states
 */
export default function useVisualMode(initial){
  const[mode, setMode] = useState(initial);
  const[history, setHistory] = useState([initial]);

  function transition(mode, replace = false){
    setMode(mode);
    replace ? setHistory(history) : setHistory([...history, mode])
  }

  function back(){
    let array = history.slice(0, -1)
    setHistory(array)
    history.length > 1 ? setMode(array[array.length-1]) : setMode(history[history.length-1]);
  }

  return {
    mode,
    transition,
    back
  }
}