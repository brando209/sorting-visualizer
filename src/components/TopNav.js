import React, { useState } from 'react'

import './styles/TopNav.css'

function TopNav() {
    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(prev => (!prev));
    }

    return (
        <div className="top-nav">
        <h1>Sorting Visualizer</h1>
        <div className='settings'>
            <div className="settings-logo" onClick={handleClick}>{"\u2699"}</div>
            <div className="settings-container">
                <div className={"settings-menu " + (visible ? 'visible' : 'hidden')}>
                    Settings Here
                </div>
            </div>
        </div>
        </div>
    );
}

export default TopNav