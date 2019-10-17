import React from 'react'
import { StateContextProvider} from './Context'

import './App.css' 
import SortingVisualizer from './components/SortingVisualizer'

const App = () => {
    return (
        <StateContextProvider>
            <SortingVisualizer /> 
        </StateContextProvider> 
    );
}

export default App