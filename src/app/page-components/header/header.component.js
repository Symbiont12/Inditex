import React from 'react';
import cssHeader from './header.component.scss';
import mySvg from '../../resources/images/podcasts.svg';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
 
    }
    
    render() {
        return (
            <React.Fragment>
                <header className="pt-3 pt-md-1 pt-lg-1">
                    <div className="col-12 col-md-4 col-lg-4 d-flex align-items-center">
                        <img src={mySvg} alt=""/>
                        <label className={cssHeader.title}>Podcasters</label>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}
