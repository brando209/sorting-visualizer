function randomBetween(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}

export function randomArr(size) {
    let arr = Array(size).fill(1);
    arr = arr.map(() => (randomBetween(10, 500)));
    return arr;
}

function getSortedOrder(initialOrder) {
    let indices = Array(initialOrder.length).fill(0).map((z, i) => i);
    let sortedIndices = indices.sort((a, b) => {
        if(initialOrder[a] < initialOrder[b]) {
            return -1;
        } else if(initialOrder[a] > initialOrder[b]) {
            return 1;
        }
        return 0;
    });
    return sortedIndices;
}

// Modified version of code found here:
// https://codepen.io/mradamcole/pen/yWXyPz
function getRainbow(size) {
    let colors = [];

    const rainbowStop = h => {
        const f = (n, k = (n + h * 12) % 12) => .5 - .5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        const rgb2hex = (r, g, b) => "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, 0)).join('');
        return (rgb2hex(f(0), f(8), f(4)));
    }

    for (let i = 0; i < size; i++) {
        let c = i / size;
        colors.push(rainbowStop(c));
    }
    return colors;
}

export function numberBoxesFromNumbers(numbers, height, margin) {
    const numberBoxes = numbers.map((number, index) => {
        return {
            value: number,
            isOut: false,
            style: {
                width: `${number}px`,
                height: `${height}px`,
                margin: `${margin}px 0 0 0`,
                position: 'relative',
                top: 0,
                left: 0,
            }
        }
    });
    return numberBoxes;
}

function numbersFromNumberBoxes(numberBoxes) {
    const numbers = numberBoxes.map(numberBox => (numberBox.value));
    return numbers;
}

// Removes the 'transitionable' class on the 'numberBoxes'
function transitionOff() {
    let numboxRefs = document.querySelectorAll(".number-box");
    for (let numbox of numboxRefs) {
        numbox.classList.toggle('transitionable', false);
    }
}


// Adds the 'transitionable' class on the 'numberBoxes'
function transitionOn() {
    let numboxRefs = document.querySelectorAll(".number-box");
    for (let numbox of numboxRefs) {
        numbox.classList.toggle('transitionable', true);
    }
}

function resetStack(selected, size) {
    switch (selected) {
        case 1:
            return [0, 0, 0];
        case 2:
            return [1, 1, 0];
        case 3:
            return [0, size, 0];
        case 4:
            return [{ scope: [0, size - 1], instructions: ['recurse-l', 'recurse-r', 'merge', 'return'] }]
        case 5:
            return [{ scope: [0, size - 1], instructions: ['partition', 'recurse-l', 'recurse-r', 'return'], p: null }]
        default:
            return null;
    }
}

function getMergeOrder(numbers, left, mid, right) {
    let mergeOrder = [];
    let i = left, j = mid + 1;
    let merging = true;

    while (merging) {
        if (numbers[i] < numbers[j]) {
            mergeOrder.push(i++);
        } else {
            mergeOrder.push(j++);
        }
        if (i === mid + 1) {
            mergeOrder.push(j);
            merging = false;
        }
        if (j === right + 1) {
            mergeOrder.push(i);
            merging = false;
        }
    }
    return mergeOrder;
}

function getPartitionOrder(numbers, left, right) {
    let partitionOrder = [];
    let pivot = numbers[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (numbers[j] < pivot) {
            i++;
            partitionOrder.push([i, j]);
        }
    }
    partitionOrder.push([i + 1, right]);
    return partitionOrder;
}

function getIndexShifted(numberBoxes, height, margin) {
    // Calculate the index shift amount for each numberBox
    let shiftAmt = numberBoxes.map((numberBox) => {
        let n = parseFloat(numberBox.style.top)
        n /= (margin + height);
        n = Math.round(n);
        return n;
    });
    // Populate a new array based on previous array and shift amount array
    let indexShifted = Array(numberBoxes.length);
    shiftAmt.forEach((shift, index) => {
        let newElem = numberBoxes[index];
        newElem.style = {
            ...newElem.style,
            top: 0,
        };
        indexShifted[index + shift] = newElem;
    });
    return indexShifted;
}

function selection_sort_reducer(state, action) {
    let insertionIdx, currentIdx, minIdx;

    switch (action.type) {
        case 'inc-insertion':
            [insertionIdx] = state.stack;
            return {
                ...state,
                stack: [insertionIdx + 1, insertionIdx + 1, insertionIdx + 1],
            }
        case 'set-min':
            [insertionIdx, currentIdx] = state.stack;
            return {
                ...state,
                stack: [insertionIdx, currentIdx + 1, currentIdx],
            }
        case 'inc-current':
            [insertionIdx, currentIdx, minIdx] = state.stack;
            return {
                ...state,
                stack: [insertionIdx, currentIdx + 1, minIdx],
            }
        default:
            return state;
    }
}

function insertion_sort_reducer(state, action) {
    let newNumBoxes = state.numberBoxes.slice();
    let newStack = state.stack.slice();
    let [, k, j] = newStack;
    let indexShifted;

    transitionOn();

    switch (action.type) {
        case 'move-key-out':
            newNumBoxes[action.key].style = {
                ...newNumBoxes[action.key].style,
                left: '600px'
            };
            newNumBoxes[action.key].isOut = true;
            return {
                ...state,
                numberBoxes: newNumBoxes,
            }
        case 'move-key-up':
            const oldTop = parseFloat(newNumBoxes[action.key].style.top);
            let newTop = oldTop - (state.boxHeight + state.boxMargin);
            newNumBoxes[j].style = {
                ...newNumBoxes[j].style,
                top: `${state.boxHeight + state.boxMargin}px`
            }
            newNumBoxes[action.key].style = {
                ...newNumBoxes[action.key].style,
                top: `${newTop}px`
            };
            newStack[2] -= 1; // j--
            return {
                ...state,
                numberBoxes: newNumBoxes,
                stack: newStack,
            }
        case 'move-key-in':
            newNumBoxes[action.key].isOut = false;
            newNumBoxes[action.key].style = {
                ...newNumBoxes[action.key].style,
                left: 0
            };
            return {
                ...state,
                numberBoxes: newNumBoxes,
            }
        case 'set-state':
            indexShifted = getIndexShifted(newNumBoxes, state.boxHeight, state.boxMargin);
            transitionOff();
            return {
                ...state,
                numberBoxes: indexShifted,
                stack: [k + 1, k + 1, k]
            }
        default:
            return state;
    }
}

function bubble_sort_reducer(state, action) {
    let [i, j, swapped] = state.stack;
    switch (action.type) {
        case 'reset':
            [i, j, swapped] = state.stack;
            return {
                ...state,
                stack: [0, j - 1, 0],
            }
        case 'set-swapped':
            [i, j] = state.stack;
            return {
                ...state,
                stack: [i + 1, j, 1],
            }
        case 'inc-counter':
            [i, j, swapped] = state.stack;
            return {
                ...state,
                stack: [i + 1, j, swapped],
            }
        default:
            return state;
    }
}

function merge_sort_reducer(state, action) {
    let numbers, newStack, numberBoxes;
    transitionOn();

    switch (action.type) {
        case 'recurse-l':
            return {
                ...state,
                stack: [...state.stack, { scope: [action.left, action.mid], instructions: ['recurse-l', 'recurse-r', 'merge', 'return'] }]
            }
        case 'recurse-r':
            return {
                ...state,
                stack: [...state.stack, { scope: [action.mid + 1, action.right], instructions: ['recurse-l', 'recurse-r', 'merge', 'return'] }]
            }
        case 'merge':
            numbers = state.numbers.slice();
            numberBoxes = state.numberBoxes.slice();
            newStack = state.stack.slice();
            // When we first enter the merge step, move all the boxes in the current 'scope' out of position
            if (!newStack[0].mergeOrder) {       // Use the bottom of the stack to store merge order
                // Move each numberBox within the current 'scope' to the right
                for (let index in state.numbers) {
                    if (index >= state.stack[state.stack.length - 1].scope[0] && index <= state.stack[state.stack.length - 1].scope[1]) {
                        numberBoxes[index].style = {
                            ...numberBoxes[index].style,
                            left: '600px'
                        };
                        numberBoxes[index].isOut = true;
                    }
                }
                // Calculate the order in which to merge and place an object containing this order at the bottom of the stack
                let mergeOrder = getMergeOrder(numbers, action.left, action.mid, action.right);
                newStack.unshift({ mergeOrder: mergeOrder, mergeIdx: action.left, compared: [action.left, action.mid + 1] });
            } else {    // As long as the object with property 'mergeOrder' is at the bottom, merge the next element
                let next = newStack[0].mergeOrder.shift();          // Index of next element to be merged into original array
                let idx = newStack[0].mergeIdx;                     // Index where the merged element will be placed
                const unit = state.boxHeight + state.boxMargin;

                if (next === undefined) {    // We are either finished with this merge step or the rest is already sorted
                    // If the rest of the numbers out of place are already sorted, move them into correct position
                    // If there are any out do move else do index shift
                    if (idx <= action.right) {
                        for (let i = 0; i < numberBoxes.length; i++) {
                            let numberBox = numberBoxes[i];
                            if (numberBox.isOut) {
                                numberBox.style = {
                                    ...numberBox.style,
                                    top: `${(idx - i) * unit}px`,
                                    left: 0,
                                }
                                numberBox.isOut = false;
                                idx++;
                            }
                        }
                    }
                    // Remove object with property 'mergeOrder' from the bottom of stack
                    newStack.shift();
                    // Remove merge instruction from current 'scope'
                    newStack[newStack.length - 1].instructions.shift();

                    let indexShifted = getIndexShifted(numberBoxes, state.boxHeight, state.boxMargin)
                    // Set the numberBoxes and numbers to be in the new order
                    numberBoxes = indexShifted;
                    numbers = numbersFromNumberBoxes(numberBoxes);

                    transitionOff();
                } else { // Move number box to correct position
                    let displacement = idx - next;
                    const newTop = `${displacement * unit}px`;

                    numberBoxes[next].style = {
                        ...numberBoxes[next].style,
                        top: newTop,
                        left: 0,
                    }
                    numberBoxes[next].isOut = false;
                    // Increment the index that the merged element will be inserted into
                    newStack[0].mergeIdx += 1;
                    // Increment which elements are being compared
                    (next <= action.mid) ? newStack[0].compared[0]++ : newStack[0].compared[1]++;
                }
            }
            return {
                ...state,
                numbers: numbers,
                numberBoxes: numberBoxes,
                stack: newStack,
            }
        default:
            return state;
    }
}

function quick_sort_reducer(state, action) {
    let newStack, numbers, numberBoxes;
    switch (action.type) {
        case 'partition':
            newStack = state.stack.slice();
            numbers = state.numbers.slice();
            numberBoxes = state.numberBoxes.slice();

            if (!newStack[0].partitionOrder) {
                let partitionOrder = getPartitionOrder(state.numbers, action.left, action.right);
                let partitionIdx = partitionOrder[partitionOrder.length - 1][0];
                newStack.unshift({ partitionOrder: partitionOrder, partitionIdx: partitionIdx })
                newStack[newStack.length - 1].p = partitionIdx;
            } else {
                let nextSwap = newStack[0].partitionOrder.shift();
                console.log(nextSwap);
                if (nextSwap === undefined) {
                    newStack[newStack.length - 1].instructions.shift();
                    newStack.shift();
                } else {
                    // Swap
                    let temp = numbers[nextSwap[0]];
                    numbers[nextSwap[0]] = numbers[nextSwap[1]];
                    numbers[nextSwap[1]] = temp;
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                }

            }
            return {
                ...state,
                numbers: numbers,
                numberBoxes: numberBoxes,
                stack: newStack,
            }
        case 'recurse-l':
            return {
                ...state,
                stack: [...state.stack, { scope: [action.left, action.p - 1], instructions: ['partition', 'recurse-l', 'recurse-r', 'return'], p: null }]
            }
        case 'recurse-r':
            return {
                ...state,
                stack: [...state.stack, { scope: [action.p + 1, action.right], instructions: ['partition', 'recurse-l', 'recurse-r', 'return'], p: null }]
            }
        default:
            return state;
    }
}

export default function reducer(state, action) {
    let numbers, numberBoxes, colorBoxes, newStack, returnTo;

    switch (action.algorithm) {
        case 'selection-sort':
            return selection_sort_reducer(state, action);
        case 'insertion-sort':
            return insertion_sort_reducer(state, action);
        case 'bubble-sort':
            return bubble_sort_reducer(state, action);
        case 'merge-sort':
            return merge_sort_reducer(state, action);
        case 'quick-sort':
            return quick_sort_reducer(state, action);
        default:
            switch (action.type) {
                case 'size-change':
                    numbers = randomArr(Number(action.size));
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        size: Number(action.size),
                        numbers: numbers,
                        reserve: numbers,
                        numberBoxes: numberBoxes,
                        stack: resetStack(state.selected, Number(action.size)),
                        isRunning: false,
                    };
                case 'speed-change':
                    return { ...state, speed: Number(action.speed) };
                case 'selection-change':
                    numbers = state.reserve;
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        selected: Number(action.selection),
                        numbers: numbers,
                        numberBoxes: numberBoxes,
                        isRunning: false,
                        stack: resetStack(Number(action.selection), state.size)
                    };
                case 'change-box-size':
                    numberBoxes = numberBoxesFromNumbers(state.numbers, action.height, action.margin)
                    return {
                        ...state,
                        boxHeight: action.height,
                        boxMargin: action.margin,
                        numberBoxes: numberBoxes,
                    }
                case 'random':
                    numbers = randomArr(state.size);
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        stack: resetStack(state.selected, state.size),
                        isRunning: false,
                        numbers: numbers,
                        reserve: numbers,
                        numberBoxes: numberBoxes
                    };
                case 'reset':
                    numberBoxes = numberBoxesFromNumbers(state.reserve, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        stack: resetStack(state.selected, state.size),
                        isRunning: false,
                        numbers: state.reserve,
                        numberBoxes: numberBoxes
                    };
                case 'toggle-run':
                    return { ...state, isRunning: !state.isRunning };
                case 'finish':
                    return { ...state, stack: [state.size, 0, state.size] }
                case 'change-mode':
                    numbers = state.reserve;

                    return {
                        ...state,
                        numbers: numbers,
                        colorMode: !state.colorMode,
                    }
                case 'swap':
                    numbers = state.numbers.slice();
                    let temp = numbers[action.a];
                    numbers[action.a] = numbers[action.b];
                    numbers[action.b] = temp;
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return { ...state, numbers: numbers, numberBoxes: numberBoxes };
                case 'recursive-return':
                    newStack = state.stack.slice();
                    newStack.pop();
                    returnTo = newStack[newStack.length - 1];
                    returnTo.instructions.shift();
                    return {
                        ...state,
                        stack: newStack,
                    }
                default:
                    return state;
            }
    }
}