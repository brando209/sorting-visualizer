export function randomArr(size) {
    let arr = Array(size).fill(1);
    arr = arr.map(() => (Math.floor(Math.random() * (500 - 10)) + 10));
    return arr;
}

export function numberBoxesFromNumbers(numbers, height, margin) {
    const numberBoxes = numbers.map(number => {
        return {
            value: number,
            isOut: false,
            style: {
                width: `${number}px`,
                height: `${height}px`,
                margin: `${margin}px 0 0 0`,
                background: 'grey',
                position: 'relative',
                top: 0,
                left: 0,
            }
        }
    });
    return numberBoxes;
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

// Merge function used in merge sort algorithm
// Takes two sorted arrays and combines them, returning one sorted array
function mergeSortedArrays(a, b) {
    let newArr = [];
    let i = 0, j = 0;
    let merging = true;
    while (merging) {
        if (a[i] < b[j]) {
            newArr.push(a[i]);
            i++;
        }
        else {
            newArr.push(b[j]);
            j++;
        }
        if (i === a.length) {
            //put the rest of b in newArr
            for (; j < b.length; j++) {
                newArr.push(b[j]);
            }
            merging = false;
        }
        if (j === b.length) {
            //put the rest of a in newArr
            for (; i < a.length; i++) {
                newArr.push(a[i]);
            }
            merging = false;
        }
    }
    return newArr;
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
        case 'set-state':
            let shiftAmt = newNumBoxes.map((numberBox) => {
                let n = parseFloat(numberBox.style.top)
                n /= (state.boxMargin + state.boxHeight);
                n = Math.round(n);
                console.log(n)
                return n;
            });
            let newArr = Array(newNumBoxes.length);
            shiftAmt.forEach((shift, index) => {
                let newElem = newNumBoxes[index];
                newElem.style = {
                    ...newElem.style,
                    top: 0,
                };
                newArr[index + shift] = newElem;
            });
            return {
                ...state,
                numberBoxes: newArr,
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
            let leftArr = numbers.slice(action.left, action.mid + 1);
            let rightArr = numbers.slice(action.mid + 1, action.right + 1);
            let insert = mergeSortedArrays(leftArr, rightArr);
            insert.forEach((value, i) => {
                numbers.splice(action.left + i, 1, value);
            });
            newStack = state.stack.slice();
            newStack[newStack.length - 1].instructions.shift();
            numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
            return { ...state, numbers: numbers, numberBoxes: numberBoxes, stack: newStack };
        default:
            return state;
    }
}

function quick_sort_reducer(state, action) {
    let newStack;
    switch (action.type) {
        case 'partition':
            newStack = state.stack.slice();
            newStack[newStack.length - 1].instructions.shift();
            newStack[newStack.length - 1].p = action.p;
            return {
                ...state,
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
    let numbers, numberBoxes, newStack, returnTo;

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
                        numberBoxes: numberBoxes,
                        stack: resetStack(state.selected, Number(action.size)),
                    };
                case 'speed-change':
                    return { ...state, speed: Number(action.speed) };
                case 'selection-change':
                    numbers = randomArr(state.size);
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        selected: Number(action.selection),
                        numbers: numbers,
                        numberBoxes: numberBoxes,
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
                case 'reset':
                    numbers = randomArr(state.size);
                    numberBoxes = numberBoxesFromNumbers(numbers, state.boxHeight, state.boxMargin);
                    return {
                        ...state,
                        stack: resetStack(state.selected, state.size),
                        isRunning: false,
                        numbers: numbers,
                        numberBoxes: numberBoxes
                    };
                case 'init-stack':
                    return {
                        ...state,
                        stack: resetStack(state.selected, state.size),
                    }
                case 'toggle-run':
                    return { ...state, isRunning: !state.isRunning };
                case 'finish':
                    return { ...state, stack: [state.size, 0, state.size] }
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