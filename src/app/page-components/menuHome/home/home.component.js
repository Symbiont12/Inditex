import React from 'react';
import './home.component.scss';
import {NavLink} from 'react-router-dom';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.mostrarInfoApp = this.mostrarInfoApp.bind(this);
    }

    mostrarInfoApp (event) {
        let tarjeta = event.currentTarget.getAttribute('clavetarjeta'), appSeleccionada = null;
        this.props.datosAplicacionesPodcasts.forEach((fila) => tarjeta === fila.id.attributes["im:id"] ? appSeleccionada = fila : null );
        sessionStorage.setItem("appSeleccionada", JSON.stringify(appSeleccionada));
    }

    render() {
        return (
            <div className='col-12 p-2 pt-3 p-md-3 p-lg-3' >
                <h5 className="mb-3">Podscasts</h5>
                <div className="d-flex col-12 flex-wrap">
                    {this.props.datosAplicacionesPodcasts.map((params, index) => {
                        return <Tarjeta eventoClick={this.mostrarInfoApp} key={index} params={params} />
                    })}
                </div>
            </div>
        );
    }
}

const Tarjeta = (props)=>{

    const ocultarTexto = (texto) =>{
        return texto.length > 19 ? texto.substring(0, 16) + '...' : texto
    }

    return (
        <div className="col-12 col-lg-2 col-md-12 pe-0 pe-md-2 pe-lg-2">
            <NavLink to='/podcast/:podcastId'>
                <div id="boton" clavetarjeta={props.params.id.attributes["im:id"]} className="card btn btn-primaryCard" onClick={props.eventoClick}>
                    <div className="flex-column g-0">
                        <div className="col-md-12 col-5 d-flex align-items-center pt-2">
                            <img src={props.params.img[1].label} className="img-fluid mx-auto d-block" alt="..."/>
                        </div>
                        <div className="col-md-12 col-5 d-flex align-items-center p-0">
                            <div className="card-body">
                                <h5 className="card-title colorB">{ocultarTexto(props.params.name.label)}</h5>
                                <p className="card-text mb-1"><small className="text-muted">Author: {ocultarTexto(props.params.artist.label)}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}
                