import React from 'react';
import './buscador.scss'

export default class Header extends React.Component {
    constructor(props) {
        super(props);
     
        this.handleChange=this.handleChange.bind(this);
        this.filtrar=this.filtrar.bind(this);

        this.state = {
            busqueda: "",
            resultado: [],
            datos: this.props.datosAplicaciones
        }
    }
    

    handleChange(event){
        let newState = Object.assign({}, this.state)
        newState.busqueda = event.target.value;
        newState.resultado = this.filtrar(event.target.value);
        this.setState(newState);
        this.props.retornarValoresBusqueda(newState.resultado)
    }

    filtrar(terminoBusqueda){
        let resultadoBusqueda = this.state.datos.filter((elemento)=> {
            if(elemento.name.label.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) || elemento.artist.label.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
                return elemento
            }
        })
        return resultadoBusqueda;
    }

    render() {
        return (
            <div className="col-12 col-md-3 col-lg-3">
                <input type="text" value={this.state.busqueda} onChange={this.handleChange} className="form-control search" placeholder="Buscar podcasts"/>
            </div>
        );
    }
}

