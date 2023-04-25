import './detalleEpisodio.component.scss';
import Modal from '../../../common-components/modal/modal.component';
import HttpService from '../../../common-services/http-service/http.service';
import React from 'react';
import {NavLink} from 'react-router-dom';
import withRouter from '../../../common-components/router/withRouter';
import Utilidades from '../../../common-services/utilidades/utilidades';
import ReactAudioPlayer from 'react-audio-player';

class DetalleEpisodio extends React.Component {
    constructor(props) {
        super(props);
        

        this.cerrarModal = this.cerrarModal.bind(this);
        this.cargarAppPodcasts = this.cargarAppPodcasts.bind(this);
        this.cargarDetallePodcasts = this.cargarDetallePodcasts.bind(this);
        this.mostrarDetalleAudio = this.mostrarDetalleAudio.bind(this);


        this.state = {
            audioSeleccionado: "",
            cargaApp: false,
            appSeleccionada: [],
            mostrarModal: false,
            mensaje: 'Error al conectarse con el servidor.',
            mensaje2: '' 
        }

    }

    componentDidMount() {
        this.mostrarDetalleAudio();
    }

    mostrarDetalleAudio(){
        
        var appS = JSON.parse(sessionStorage.getItem("appSeleccionada"));
        if (isNaN(this.props.params.podcastId)) {
            this.props.params.podcastId = null
            if(sessionStorage.getItem("episodios")) { sessionStorage.removeItem("episodios") }
        }else{
            if(appS && appS.id.attributes["im:id"] !== this.props.params.podcastId){
                sessionStorage.removeItem("appSeleccionada");
                localStorage.removeItem("fecha");
            }
        }

        const newState = Object.assign({}, this.state)
        if(sessionStorage.getItem("appSeleccionada") === null){
            this.cargarAppPodcasts(newState)
        } else{
            newState.appSeleccionada = JSON.parse(sessionStorage.getItem("appSeleccionada"));
            this.cargarDetallePodcasts(newState, this.props.params.podcastId ? this.props.params.podcastId : newState.appSeleccionada.id.attributes["im:id"])
        }
    }

    async cargarAppPodcasts(newState){
        let diasDiferencia = 1;
        if(localStorage.getItem("fecha")) {diasDiferencia = Utilidades.comprobarDias(new Date ());}
        if(localStorage.getItem("fecha") === null || diasDiferencia >= 1){ //
            try {
                const response = await HttpService.get("https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json")
                if(response){
                    Utilidades.cambiarNombreAtributos(response.feed.entry);
                    const result = response.feed.entry.filter(data => {
                        return data.id.attributes['im:id'] === this.props.params.podcastId
                    });
                    if(result.length > 0 || this.props.params.podcastId === null) {
                        newState.appSeleccionada = result[0];
                        sessionStorage.setItem("appSeleccionada", JSON.stringify(newState.appSeleccionada));
                        this.cargarDetallePodcasts(newState, this.props.params.podcastId)
                    }else{
                        newState.mostrarModal = true;
                        newState.cargaApp = true;
                        newState.mensaje2 = 'El identificador no es correcto, por favor vuelva a insertar otro identificador.';
                        this.setState(newState) 
                    }
                }
            } catch(error) {
                newState.mostrarModal = true;
                newState.cargaApp = true;
                newState.mensaje2 = 'Ha fallado la carga de los podcasts.';
                this.setState(newState) 
            }
        }else {
            newState.appSeleccionada = JSON.parse(sessionStorage.getItem("appSeleccionada"));
            this.cargarDetallePodcasts(newState)
        } 
    }

    async cargarDetallePodcasts(newState, id){
        let uri = `https://itunes.apple.com/lookup?id=${parseInt(id)}&media=podcast&entity=podcastEpisode&limit=20`
        let encoded = encodeURIComponent(uri);
        try {
            const response = await HttpService.get(encoded)
            if(response){
                if(response.resultCount !== 0){
                    newState.appSeleccionada.episodes = response.results;
                    const result = response.results.filter(data => {
                        return data.trackId === parseInt(this.props.params.episodeId)
                    });
                    if((result.length > 0 && this.props.params.episodeId )) {
                        newState.audioSeleccionado = result[0];
                        sessionStorage.setItem("audioSeleccionado", JSON.stringify(newState.audioSeleccionado));
                    }else if(sessionStorage.getItem("audioSeleccionado")){
                        newState.audioSeleccionado = JSON.parse(sessionStorage.getItem("audioSeleccionado"));
                    }else{
                        newState.mostrarModal = true;
                        newState.cargaApp = true;
                        newState.mensaje2 = 'El identificador no es correcto, por favor vuelva a insertar otro identificador.';
                        this.setState(newState) 
                    } 
                    newState.cargaApp = true;
                    this.setState(newState);
                }else {
                    newState.mostrarModal = true;
                    newState.cargaApp = true;
                    newState.mensaje2 = 'No existen datos para ese identificador';
                    this.setState(newState) 
                }
            }
        } catch(error) {
            newState.mostrarModal = true;
            newState.cargaApp = true;
            newState.mensaje2 = 'Ha fallado la carga de los detalles de los podcasts.';
            this.setState(newState) 
        }
    }

   

    cerrarModal(){
        let newState = Object.assign({}, this.state);
        newState.mostrarModal = false;
        this.setState(newState);
    }

render() {
    
    if(this.state.cargaApp) {
        return (
            <React.Fragment>
            {!this.state.mostrarModal && 
                <div className={['main d-flex flex-wrap'].join(' ')}>
                    <section className="p-2 p-md-4 p-lg-4">
                        <div className='back'><NavLink to='/'><div >Podcaster</div></NavLink></div>
                        <div className="d-flex col-12 flex-wrap">
                            <div className="col-12 col-lg-2 col-md-2  ">  
                                <div className='bord p-3 rounded bg-light me-2'>   
                                    <div className="col-12 mx-auto p-3">
                                        <NavLink to='/podcast/:podcastId'><img src={this.state.appSeleccionada.episodes[0].artworkUrl600} className="img-fluid mx-auto d-block" alt="..." /></NavLink>
                                        </div>
                                        <div className="col-12 mb-2 rounded pad bg-light title">
                                            <div className="fw-bold h5 accordion-header">
                                                <NavLink to='/podcast/:podcastId'><p className="pmargin">{this.state.appSeleccionada.name.label}</p></NavLink>
                                            </div>
                                            <div className="obliq">
                                                <NavLink to='/podcast/:podcastId'><p>by {this.state.appSeleccionada.artist.label}</p></NavLink>
                                            </div>
                                        </div>                                              
                                        <div className="col-12 mb-2 rounded pad bg-light">
                                            <div className="">
                                                <p className='desc'>Descripción:</p>
                                                <p>{this.state.appSeleccionada.summary.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            <div className="col-12 col-lg-7 col-md-7 descripcion">
                                <div className="col-12 mb-2 rounded episode bg-light bord">
                                    <h4 className="fw-bold pad">Descripción: {this.state.audioSeleccionado.trackName}</h4>
                                    <div style= {{padding: "1rem"}}>{this.state.audioSeleccionado.description}</div>
                                    <div className='Audio'>
                                        <div>
                                            <ReactAudioPlayer className="audioReprod" src={this.state.audioSeleccionado.previewUrl} ref={(element) => { this.audio = element; }} controls />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                }
                {this.state.mostrarModal && <Modal mensaje={this.state.mensaje} mensaje2={this.state.mensaje2} clickBoton={this.cerrarModal}/>}
            </React.Fragment>
            );
        }else {return ''}
    }
} 


export default withRouter(DetalleEpisodio);
