import React, { useReducer, useMemo, createContext } from 'react'
import reducer, { randomArr } from './reducer'

export const StateContext = createContext();

function initialState() {
    const size = 10;
    const numbers = randomArr(size);
    const boxHeight = 25;
    const boxMargin = 5;
    const numberBoxes = numbers.map(number => {
        return {
            value: number,
            isOut: false,
            style: {
                width: `${number * 10}px`,
                height: `${boxHeight}px`,
                margin: `${boxMargin}px 0 0 0`,
                position: 'relative',
                top: 0,
                left: 0,
            }
        }
    });
    return {
        size: size,
        numbers: numbers,
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


