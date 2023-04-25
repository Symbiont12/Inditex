import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import AppComponent from './app/app.component';
import './app/resources/sass/fonts.scss'


window.onload = () =>{
    let root = document.createElement('div');
    root.style.width = '100%';
    root.style.height = '100%';
    document.body.className = "col-12 ";
    document.body.appendChild(root);
    ReactDOM.render( <AppComponent/>, root);
};