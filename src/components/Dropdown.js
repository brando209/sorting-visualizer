import React from 'react'
import './styles/Dropdown.css'

function Dropdown(props) {
    const change = (event) => {
        props.onChange(event.target.value);
    }

    return (
        <select className="dropdown-menu" onChange={change} value={props.selection}>
            <option value='0'>--Select a sorting algorithm--</option>
            <option value='1'>Selection Sort</option>
            <option value='2'>Insertion Sort</option>
            <option value='3'>Bubble Sort</option>
            <option value='4'>Merge Sort</option>
            <option value='5'>Quick Sort</option>
        </select>
    );
}

export default Dropdown