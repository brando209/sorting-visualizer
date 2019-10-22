import React, { useContext } from 'react'
import { StateContext } from '../Context'

import './styles/SortingVisualizer.css'
import useInterval from '../useInterval'
import TopNav from '../components/TopNav'
import SideNav from '../components/SideNav'
import DisplayBox from '../components/DisplayBox'

const SortingVisualizer = () => {
    const { state, dispatch } = useContext(StateContext);

    let sorter = (state.selected === 1 && stepSelectionSort) ||
        (state.selected === 2 && stepInsertionSort) ||
        (state.selected === 3 && stepBubbleSort) ||
        (state.selected === 4 && stepMergeSort) ||
        (state.selected === 5 && stepQuickSort);

    useInterval(sorter, state.isRunning ? (1000 - (state.speed * 10)) : null);

    const handleReset = () => {
        dispatch({ type: 'reset' });
    }

    const handleStep = () => {
        state.selected === 1 && requestAnimationFrame(stepSelectionSort);
        state.selected === 2 && requestAnimationFrame(stepInsertionSort);
        state.selected === 3 && requestAnimationFrame(stepBubbleSort);
        state.selected === 4 && requestAnimationFrame(stepMergeSort);
        state.selected === 5 && requestAnimationFrame(stepQuickSort);
    }

    const handleRun = () => {
        dispatch({ type: 'toggle-run' });
    }

    function stepSelectionSort() {
        if (state.stack[0] === null) {
            dispatch({ type: 'init-stack' });
            return;
        }

        let [insertionIndex, currentIndex, minIndex] = state.stack;
        if (insertionIndex === state.numbers.length) {
            dispatch({ type: 'toggle-run' });
            return;
        }
        if (currentIndex === state.numbers.length) {
            swap(insertionIndex, minIndex);
            // Increment the insertion index and set the current and min to that index
            dispatch({ algorithm: 'selection-sort', type: 'inc-insertion' })
            return;
        }
        if (state.numbers[currentIndex] < state.numbers[minIndex]) {
            dispatch({ algorithm: 'selection-sort', type: 'set-min' })
            // Set min and increment current
            return;
        }
        // Increment current
        dispatch({ algorithm: 'selection-sort', type: 'inc-current' })
    }

    function stepInsertionSort() {
        let [i, k, j] = state.stack;

        if (i >= state.numberBoxes.length) {
            console.log("Done!")
            dispatch({ type: 'toggle-run' });
            return;
        }
        if (j === state.numberBoxes.length - 1) {
            dispatch({ algorithm: 'insertion-sort', type: 'set-state' })
            return;
        }
        if (j < 0) {
            dispatch({ algorithm: 'insertion-sort', type: 'move-key-in', key: k });
            return;
        }

        if (state.numberBoxes[i].value < state.numberBoxes[j].value) {
            console.log(state.numberBoxes[i].value + " < " + state.numberBoxes[j].value);
            if (state.numberBoxes[k].isOut) {
                dispatch({ algorithm: 'insertion-sort', type: 'move-key-up', key: k })
            }
            else {
                dispatch({ algorithm: 'insertion-sort', type: 'move-key-out', key: k })
            }
        }
        else {
            dispatch({ algorithm: 'insertion-sort', type: 'move-key-in', key: k })
        }
    }

    function stepBubbleSort() {
        if (state.stack[0] === null) {
            dispatch({ type: 'init-stack' });
            return;
        }

        let [i, , swapped] = state.stack; // TODO: Only using 2 variables
        if (state.numbers[i] > state.numbers[i + 1]) {
            swap(i, i + 1);
            // A pass has completed in which swaps have occured, reset for next pass
            if (i + 1 === state.numbers.length - 1 && swapped === 1) {
                dispatch({ algorithm: 'bubble-sort', type: 'reset' })
                return;
            }
            // Increment counter and set swapped
            dispatch({ algorithm: 'bubble-sort', type: 'set-swapped' })
            return;
        }
        else { // TODO: Check if we can remove this else and get rid of duplicate code
            // A pass has completed in which swaps have occured, reset for next pass
            if (i + 1 === state.numbers.length - 1 && swapped === 1) {
                dispatch({ algorithm: 'bubble-sort', type: 'reset' })
                return;
            }
        }
        // The pass has completed in which no swaps have occured, done!
        if (i + 1 === state.numbers.length && swapped === 0) {
            dispatch({ type: 'finish' });
            dispatch({ type: 'toggle-run' });
            return;
        }
        // Increment counter for next comparion
        dispatch({ algorithm: 'bubble-sort', type: 'inc-counter' })
    }

    function stepMergeSort() {
        let next = state.stack[state.stack.length - 1];
        let instruction = next.instructions[0];
        let l = next.scope[0];
        let r = next.scope[1];
        let mid = Math.floor((l + r) / 2);

        if (instruction === 'return') {
            // Termination condition: last elements returns
            if (state.stack.length === 1) {
                dispatch({ type: 'toggle-run' });
                return;
            }
            // return
            dispatch({ type: 'recursive-return' });
            return;
        }

        // Single element
        if (l === r) {
            next.instructions.splice(0, 3); // Skip to return instruction
            return;
        }

        if (instruction === 'recurse-l') {
            dispatch({ algorithm: 'merge-sort', type: 'recurse-l', left: l, mid: mid });
        } else if (instruction === 'recurse-r') {
            dispatch({ algorithm: 'merge-sort', type: 'recurse-r', mid: mid, right: r });
        } else if (instruction === 'merge') {
            dispatch({ algorithm: 'merge-sort', type: 'merge', left: l, mid: mid, right: r })
        }
    }

    function stepQuickSort() {
        let next = state.stack[state.stack.length - 1];
        let instruction = next.instructions[0];
        let l = next.scope[0];
        let r = next.scope[1];
        let p = next.p;

        if (instruction === 'return') {
            if (state.stack.length === 1) {
                dispatch({ type: 'toggle-run' });
                return;
            }
            dispatch({ type: 'recursive-return' });
            return;
        }
        // Base case, single element
        if (l >= r) {
            next.instructions.splice(0, 3); // Skip to return instruction
            return;
        }

        if (instruction === 'partition') {
            dispatch({ algorithm: 'quick-sort', type: "partition", left: l, right: r });
        }
        else if (instruction === 'recurse-l') {
            dispatch({ algorithm: 'quick-sort', type: 'recurse-l', left: l, p: p });
        } else if (instruction === 'recurse-r') {
            dispatch({ algorithm: 'quick-sort', type: 'recurse-r', right: r, p: p });
        }
    }

    function swap(a, b) {
        dispatch({ type: 'swap', a, b });
    }

    return (
        <div className='sorting-visualizer'>
            <TopNav />
            <div className="main-app">
                <SideNav onReset={handleReset} onStep={handleStep} onRun={handleRun} />
                <DisplayBox />
            </div>
        </div>
    );
};

export default SortingVisualizer