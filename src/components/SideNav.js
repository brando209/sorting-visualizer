import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../Context'

import './styles/SideNav.css'
import Button from './Button'
import Slider from './Slider'
import DetailsPanel from './DetailsPanel'

function getDetailText(selection) {
    let minElementStyle = {
        background: 'lightgreen',
        color: 'black',
    }
    const unsortedElementStyle = {
        background: 'grey',
        color: 'black',
    }
    const sortedElementStyle = {
        background: 'rgb(60, 150, 60)',
        color: 'black',
    }

    switch(selection) {
        case 1:
            return (
                <span className='description-text'>
                    The selection sort algorithm sorts an array by repeatedly finding the <span style={minElementStyle}>minimum element</span> (considering ascending order) 
                     from the <span style={unsortedElementStyle}>unsorted subarray</span> and putting it in its final sorted position.
                     In every iteration of selection sort, the <span style={minElementStyle}>minimum element</span> from the <span style={unsortedElementStyle}>unsorted subarray</span> is picked and at the end of the iteration it is swapped with the first element of the <span style={unsortedElementStyle}>unsorted subarray</span> and the length of the <span style={sortedElementStyle}>sorted subarray</span> increases by one. 
                </span>
            );
        case 2:
            return (
                <span className='description-text'>
                    The insertion sort algorithm sorts an array by repeatedly moving the first element of the <span style={unsortedElementStyle}>unsorted subarray</span> into its correct position within the <span style={sortedElementStyle}>sorted subarray</span>.
                     In every iteration of insertion sort, the <span style={minElementStyle}>next element</span> of the <span style={unsortedElementStyle}>unsorted subarray</span> is compared with elements from the <span style={sortedElementStyle}>sorted subarray</span> until its position is found and it is inserted into this position.
                </span>
            );
        case 3:
            return (
                <span className='description-text'>
                </span>
            );
        case 4:
            return (
                <span className='description-text'>

                </span>
            );
        case 5:
            return (
                <span className='description-text'>

                </span>
            );
        default:
            return (
                <span className='description-text'>
                    Select a sorting algorithm. Then, click 'Run' to begin the animation or click 'Step' to step through the animation
                </span>
            );
            
    }

}

// Got from stack overflow to set a rule of a stylesheet
const setStyleRule = function(selector, rule, sheetName="SideNav") {
    var sheets = document.styleSheets,
        stylesheet = sheets[(sheets.length - 1)];

    for( var i in document.styleSheets ){
        if( sheets[i].href && sheets[i].href.indexOf(sheetName + ".css") > -1 ) {
            stylesheet = sheets[i];
            break;
        }
    }

    if( stylesheet.addRule) {
        stylesheet.addRule(selector, rule);
    }

    else if( stylesheet.insertRule )
        stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
}

function SideNav(props) {
    const { state, dispatch } = useContext(StateContext)
    const [detailText, setDetailText] = useState(getDetailText(state.selection));

    useEffect(() => {
        setDetailText(getDetailText(state.selected));
    }, [state.selected]);

    function handleSizeChange(newSize) {
        dispatch({ type: 'size-change', size: newSize });
    }
    function handleSpeedChange(newSpeed) {
        let selector = '.number-box.transitionable';
        if(newSpeed <= 60) {
            setStyleRule(selector, 'transition-duration: 0.4s, 0.2s');
        } else if (newSpeed <= 70) {
            setStyleRule(selector, 'transition-duration: 0.2s, 0.125s');
        } else  if (newSpeed <= 80) {
            setStyleRule(selector, 'transition-duration: 0.05s, 0.025s');
        } else {
            setStyleRule(selector, 'transition-duration: 0.025s, 0.0125s');
        }
        dispatch({ type: 'speed-change', speed: newSpeed });
    }

    return (
        <div className="side-nav">
            <DetailsPanel detailText={detailText}/>
            <span className="horizontal-line"></span>
            <div className="controls-panel">
                <Button onClick={props.onRandom}>Random</Button>
                <Button onClick={props.onReset}>Reset</Button>
                <Button onClick={props.onStep}>Step</Button>
                <Button onClick={props.onRun}>{state.isRunning ? 'Stop' : 'Run'}</Button>
                <Slider onChange={(speed) => handleSpeedChange(speed)} min='0' max='100' step='10' value={state.speed}>Animation Speed:</Slider>
                <Slider onChange={(size) => handleSizeChange(size)} min='5' max='300' step='1' value={state.size}>Array Size:</Slider>
            </div>
        </div>
    );
}

export default SideNav