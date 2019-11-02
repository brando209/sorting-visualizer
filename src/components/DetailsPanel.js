import React from 'react';

const DetailsPanel = (props) => {

    return (
        <div className='instructions'>
            <p>
                {props.detailText}
            </p>
        </div>
    );
}

export default DetailsPanel;