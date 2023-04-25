import React from 'react';
import cssBarraNav from './barraNav.component.scss';

export default class BarraNav extends React.Component {
    constructor(props) {
        super(props);

    }
    
    render() {
        return (
            <div className={[cssBarraNav.col12, cssBarraNav.filter].join(' ')}></div>
        );
    }
}
