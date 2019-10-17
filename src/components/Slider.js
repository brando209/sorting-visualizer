import React from 'react' 
import './styles/Slider.css'

const Slider = (props) => {
    return(
        <div className="slider-container">
            <div>{props.children}</div>
            <input 
                type="range" 
                min={props.min} 
                max={props.max} 
                value={props.value} 
                className="slider" 
                id="myRange" 
                onChange={(e) => {
                    props.onChange(e.target.value);
                }}
            />
        </div>
    );
}

export default Slider