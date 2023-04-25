import React from 'react';
import cssMenuHome from './menuHome.component.scss';
import Home from './home/home.component';
import Buscador from '../../common-components/buscador/buscador';

export default class MenuHome extends React.Component {
    constructor(props) {
        super(props);

        this.establecerValoresBusqueda = this.establecerValoresBusqueda.bind(this);

        this.state = {
            datosAplicacionesPodcasts: this.props.datosAplicacionesPodcasts
        }
    }

    establecerValoresBusqueda(valor){
        let newState = Object.assign({}, this.state)
        newState.datosAplicacionesPodcasts = valor;
        this.setState(newState);
    }

    render() {
        return (
            <section >
                <div className={[cssMenuHome.col12, cssMenuHome.barra].join(' ')}>
                    <div className='home'><h4 className='fw-bold longitud' >{this.state.datosAplicacionesPodcasts.length}</h4></div>
                    <Buscador datosAplicaciones={this.props.datosAplicacionesPodcasts} retornarValoresBusqueda={this.establecerValoresBusqueda}/>
                </div>
                <Home datosAplicacionesPodcasts={this.state.datosAplicacionesPodcasts}/>  
            </section>
        );
    }
}

