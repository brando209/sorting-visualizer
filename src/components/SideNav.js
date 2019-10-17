import React, { useContext } from 'react'
import { StateContext } from '../Context'

import './styles/SideNav.css'
import Button from './Button'
import Dropdown from './Dropdown'
import Slider from './Slider'

function SideNav(props) {
    const { state, dispatch } = useContext(StateContext)

    function handleSizeChange(newSize) {
        dispatch({ type: 'size-change', size: newSize });
    }
    function handleSpeedChange(newSpeed) {
        dispatch({ type: 'speed-change', speed: newSpeed });
    }
    function handleSelectionChange(newSelection) {
        dispatch({ type: 'selection-change', selection: newSelection });
    }

    return (
        <div className="side-nav">
            <div className='instructions'>
                <h3>Instructions: </h3>
                <p>
                    Select a sorting algorithm below.
                    Then, click 'Run' to begin the animation or click 'Step' to step through the animation
                </p>
            </div>
            <hr />
            <Dropdown onChange={(selection) => handleSelectionChange(selection)} selection={state.selected}></Dropdown>
            <hr />
            <Button onClick={props.onReset}>Reset</Button>
            <Button onClick={props.onStep}>Step</Button>
            <Button onClick={props.onRun}>{state.isRunning ? 'Stop' : 'Run'}</Button>
            <Slider onChange={(speed) => handleSpeedChange(speed)} min='0' max='100' value={state.speed}>Animation Speed:</Slider>
            <Slider onChange={(size) => handleSizeChange(size)} min='5' max='198' value={state.size}>Array Size:</Slider>
        </div>
    );
}

export default SideNav