import React, { useContext, useState, useEffect, useRef } from 'react';
import { StateContext } from '../Context';
import './styles/DisplayBox.css'

function getColor(index, state) {
    switch(state.selected) {
        case 1: // Selection sort
            if(index < state.stack[0]) return 'green';
            if(index === state.stack[1]) return 'rgba(0, 0, 0, 0.3)';
            if(index === state.stack[2]) return 'lightgreen';
            return 'grey';
        case 2: // Insertion sort
            if(index === state.stack[1]) return 'lightgreen';
            if(index <= state.stack[1]) return 'green';
            if(index === state.stack[2]) return 'rgba(0, 0, 0, 0.3)';
            return 'grey'
        case 3: // Bubble sort
            if(index === state.stack[0] || index === state.stack[0] + 1) return 'rgba(0, 0, 0, 0.3)';
            if(index >= state.stack[1]) return 'green';
            return 'grey';
        case 4: // Merge sort
            let current = state.stack[state.stack.length - 1];
            let mergeOrder = state.stack[0];
            let mid = Math.floor((current.scope[0] + current.scope[1]) / 2);
            if(index >= current.scope[0] && index <= current.scope[1]) {
                if(mergeOrder.mergeOrder && state.numberBoxes[index].isOut && (index === mergeOrder.compared[0] || index === mergeOrder.compared[1])) {
                    return 'red';
                }
                return 'rgba(0, 0, 0, 0.3)';
            }
            return 'grey';
        case 5: // Quick sort
            if(index === state.stack[state.stack.length - 1].p) return 'rgba(0, 0, 0, 0.3)';

            return 'grey';
        default:
            return 'transparent';
    }
}

const DisplayBox = (props) => {
    const { state, dispatch } = useContext(StateContext);

    const display = useRef();
    const initialDisplayHeight = useRef();

    useEffect(() => {
        initialDisplayHeight.current = display.current.clientHeight;
    }, []);

    useEffect(() => {
        let height = initialDisplayHeight.current / (state.size + 1);
        const margin = 0.35 * height;
        height -= margin;
        dispatch({ type: 'change-box-size', height, margin })
    }, [state.size]);

    const numberBoxComponents = state.numberBoxes.map((numberBox, index) => {
        let style = {
            ...numberBox.style,
            background: getColor(index, state),
        }

        return (
            <div className="number-box" key={index} style={style}>{""}</div>
        );
    });

    return (
        <div className='display-box' ref={display}>
            {numberBoxComponents}
        </div>
    );
};

export default DisplayBox;