import './detalleApp.component.scss';
import Modal from '../../common-components/modal/modal.component';
import HttpService from '../../common-services/http-service/http.service';
import React from 'react';
import withRouter from '../../common-components/router/withRouter';
import {NavLink} from 'react-router-dom';
import Utilidades from '../../common-services/utilidades/utilidades';

class DetalleApp extends React.Component {
    constructor(props) {
        super(props);
        
        this.audioSeleccionado = this.audioSeleccionado.bind(this);
        this.cerrarModal = this.cerrarModal.bind(this);
        this.cargarAppPodcasts = this.cargarAppPodcasts.bind(this);
        this.cargarDetallePodcasts = this.cargarDetallePodcasts.bind(this);
        this.mostrarDetalleApp = this.mostrarDetalleApp.bind(this);

        this.state = {
            cargaApp: false,
            appSeleccionada: [],
            mostrarModal: false,
            mensaje: 'Error al conectarse con el servidor.',
            mensaje2: '' 
        }

    }

    componentDidMount() {
        this.mostrarDetalleApp();
    }

    mostrarDetalleApp(){
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
                        localStorage.setItem("fecha", new Date())
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

    audioSeleccionado (event) {
        const audio = parseInt(event.currentTarget.getAttribute('claveaudio'))
        let audioEncontrado = "";
        this.state.appSeleccionada.episodes.forEach((fila) => audio === fila.trackId ? audioEncontrado = fila : null);
        sessionStorage.setItem("audioSeleccionado", JSON.stringify(audioEncontrado));
    }


    cerrarModal(){
        let newState = Object.assign({}, this.state);
        newState.mostrarModal = false;
        newState.cargaApp = true;
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
                                                <img src={this.state.appSeleccionada.episodes[0].artworkUrl600} className="img-fluid mx-auto d-block" alt="..." />
                                            </div>
                                            <div className="col-12 mb-2 rounded pad bg-light title">
                                                <div className="fw-bold h5 accordion-header">
                                                    <p className="pmargin">{this.state.appSeleccionada.name.label}</p>
                                                </div>
                                                <div className="obliq">
                                                    <p>by {this.state.appSeleccionada.artist.label}</p>
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
                                        <h4 className="fw-bold">Episodes: {this.state.appSeleccionada.episodes.length -1}</h4>
                                    </div>
                                    <div className="col-12 mb-2 rounded episode bg-light bord">
                                        <div className='flexAudio'>
                                            <div className='tituloAudio'>
                                                <p className='desc'>Title</p>
                                            </div>
                                            <div className="fechaDuracionAudio">
                                                <p className='desc'>Date</p>
                                                <p className='desc'>Duration</p>
                                            </div>
                                        </div>
                                        {this.state.appSeleccionada.episodes.map((params, index) => {
                                                return index === 0 ? '' : <Episodios eventoClick={this.audioSeleccionado} key={index} params={params}/>
                                        })}
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

const Episodios = (props)=>{

    const calcularFecha = (fecha = new Date()) => {
        var nuevaFecha = new Date(fecha).getFullYear() + "-" + (((new Date(fecha).getMonth()+1) >= 10) ? (new Date(fecha).getMonth()+1) 
        : "0"+(new Date(fecha).getMonth()+1)) + "-" + ((new Date(fecha).getDate() >= 10) ? new Date(fecha).getDate() 
            : "0" + new Date(fecha).getDate());
        var lista = nuevaFecha.split('-');
        return lista[2] +'/' + lista[1] + '/'+ lista[0]
    }

    const calcularMinutos = (s) => {
        
	  var ms = s % 1000;
	  s = (s - ms) / 1000;
	  var secs = s % 60;
	  s = (s - secs) / 60;
	  var mins = s % 60;
	  var hrs = (s - mins) / 60;

	  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
        
    }

    const addZ = (n) => {
	    return (n<10? '0':'') + n;
	}

    return (
        <div className='flexAudio2 '>
            <div className='tituloAudioF'>
                <a href="/podcast/:podcastId/episode/:episodeId" claveaudio={props.params.trackId} className="backAudio" onClick={props.eventoClick}>{props.params.trackName}</a>
            </div>
            <div className="fechaDuracionAudio">
                <p className="card-text line-clamp pdTopB5">{calcularFecha(props.params.releaseDate)}</p>
                <p className="card-text line-clamp pdTopB5">{calcularMinutos(props.params.trackTimeMillis)}</p>
            </div>
        </div>
    )
}
export default withRouter(DetalleApp);