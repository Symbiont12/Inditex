import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './Loading';

export default class LoadingService {

    static open(){
        LoadingService.loading = document.createElement('loading');
        document.body.appendChild(LoadingService.loading);
        ReactDOM.render(<Loading/>, LoadingService.loading);
    }

    static close(){
        ReactDOM.unmountComponentAtNode(LoadingService.loading);
        LoadingService.loading.remove();
    }
    
}