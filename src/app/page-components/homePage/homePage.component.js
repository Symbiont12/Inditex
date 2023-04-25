import './homePage.component.scss';

import BarraNavComponent from '../barraNav/barraNav.component';
import MenuHomeComponent from '../menuHome/menuHome.component';
import HttpService from '../../common-services/http-service/http.service';
import Modal from '../../common-components/modal/modal.component';
import React from 'react';
import Utilidades from '../../common-services/utilidades/utilidades';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.cargarAppPodcasts = this.cargarAppPodcasts.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);

        this.state = {
            datosAplicacionesPodcasts: [],
            mostrarModal: false,
            mensaje: 'Error al conectarse con el servidor.',
            mensaje2: ''
        }

    }

    componentDidMount(){
        this.cargarAppPodcasts();
    }

    async cargarAppPodcasts(){
        const newState = Object.assign({}, this.state);
        let diasDiferencia = 1;
        if(localStorage.getItem("fecha")) {diasDiferencia = Utilidades.comprobarDias(new Date ());}
        if((localStorage.getItem("fecha") === null || diasDiferencia >= 1) || !sessionStorage.getItem("datosAplicaciones")){ 
            try {
                const response = await HttpService.get("https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json")
                if(response){
                    newState.datosAplicacionesPodcasts = Utilidades.cambiarNombreAtributos(response.feed.entry);
                    sessionStorage.setItem("datosAplicaciones", JSON.stringify(newState.datosAplicacionesPodcasts));
                    localStorage.setItem("fecha", new Date())
                    this.setState(newState);
                }
            } catch(error) {
                    newState.mostrarModal = true;
                    newState.mensaje2 = 'Ha fallado la carga de los podcasts.';
                    this.setState(newState) 
            }
        }else {
            newState.datosAplicacionesPodcasts = JSON.parse(sessionStorage.getItem("datosAplicaciones"));
            this.setState(newState);
        } 
    }

    

    cerrarModal(){
        let newState = Object.assign({}, this.state);
        newState.mostrarModal = false;
        this.setState(newState);
    }


    render() {
        if(this.state.datosAplicacionesPodcasts.length > 0){
            return (
                <React.Fragment>
                    <BarraNavComponent />
                    <div className={['main d-flex flex-wrap'].join(' ')}>
                        <MenuHomeComponent datosAplicacionesPodcasts={this.state.datosAplicacionesPodcasts} />
                    </div>
                    {this.state.mostrarModal && <Modal mensaje={this.state.mensaje} mensaje2={this.state.mensaje2} clickBoton={this.cerrarModal} />}
                </React.Fragment>
            );
        }else {
            return (
                this.state.mostrarModal && <Modal mensaje={this.state.mensaje} mensaje2={this.state.mensaje2} clickBoton={this.cerrarModal} />
            )
        }
    }


}
