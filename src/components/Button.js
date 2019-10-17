import React from 'react'
import './styles/Button.css'

function Button(props) {
    return (
        <div className="button" onClick={props.onClick}>{props.children}</div>
    )
}

export default Button