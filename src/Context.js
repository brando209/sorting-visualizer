import React, { useReducer, useMemo, createContext } from 'react'
import reducer, { randomArr, numberBoxesFromNumbers } from './reducer'

export const StateContext = createContext();

function initialState() {
    const size = 6;
    const numbers = randomArr(size);
    const boxHeight = 75;
    const boxMargin = 15;
    const numberBoxes = numberBoxesFromNumbers(numbers);
    
    return {
        size: size,
        numbers: numbers,
        reserve: numbers,
        boxHeight: boxHeight,
        boxMargin: boxMargin,
        selected: 0,
        isRunning: false,
        speed: 90, 
        numberBoxes: numberBoxes,
        stack: null,
    }
}

export const StateContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState());
    const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);


    return (
        <StateContext.Provider value={contextValue}>
            {props.children}
        </StateContext.Provider>
    );
}


