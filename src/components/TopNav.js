import React, { useState, useContext, useEffect, useCallback, useRef } from 'react'

import './styles/TopNav.css'
import { StateContext } from '../Context';

function useClickListener(handler) {
    useEffect(() => {
        let links = document.querySelectorAll('.nav-links li');
        links.forEach(link => {
            link.addEventListener('click', handler);
        });
        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handler);
            });
        }
    }, [handler]);
}

function TopNav() {
    const [visible, setVisible] = useState(false);
    const { dispatch } = useContext(StateContext);

    // Uses callback hook so that reference never changes
    const handleSelectionClick = useCallback((event) => {
        handleSelectionChange(event.target.value);
    }, []);
    // Adds click listeners to nav links only once since handler never changes
    useClickListener(handleSelectionClick);

    // Toggles visibility of settings panel
    const handleSettingsClick = () => {
        const settingsBtn = document.querySelector('.top-nav .settings');
        setVisible(prev => {
            if (prev === true) settingsBtn.style.flex = '1';
            else settingsBtn.style.flex = '2';
            return !prev;
        });
    }

    const handleColorModeClick = () => {
        dispatch({ type: 'change-mode', mode: 'color' })
    }

    // Changes the selected algorithm
    const handleSelectionChange = (newSelection) => {
        dispatch({ type: 'selection-change', selection: newSelection });
        setActive(newSelection);
    }

    // Sets the selected algorithms' nav link to active
    function setActive(selection) {
        let links = document.querySelectorAll('.nav-links li');
        links.forEach((link, index) => {
            if (index + 1 === selection) {
                link.classList.toggle('active', true);
            } else {
                link.classList.toggle('active', false);
            }
        });
    }

    return (
        <div className="top-nav">
            <h1>Sorting Visualizer</h1>
            <div className="vertical-line" />

            <div className="nav-links-container">
                <ul className="nav-links">
                    <li value='1'>Selection sort</li>
                    <li value='2'>Insertion sort</li>
                    <li value='3'>Bubble sort</li>
                    <li value='4'>Merge sort</li>
                    <li value='5'>Quick sort</li>
                </ul>
            </div>

            <div className="vertical-line" />
            <div className='settings'>
                <div className="settings-logo" onClick={handleSettingsClick}>{"\u2699"}</div>
                <div className="settings-container">
                    <div className={"settings-content " + (visible ? 'visible' : 'hidden')}>
                        <input type="checkbox" onClick={handleColorModeClick}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNav