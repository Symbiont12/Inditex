import React from 'react';
import cssModal from './modal.scss';


class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.clickBoton = this.clickBoton.bind(this);
    }

    clickBoton() {
        this.props.clickBoton()
    }


    render(){
    return (
        <div className={cssModal.modalVentana}>
            <div className={cssModal.backDrop}></div>
            <div className={cssModal.modalGeneral}>
                <span>{this.props.mensaje}</span>
                {this.props.mensaje2 && <span>{this.props.mensaje2}</span>}
                <div className={cssModal.botoneraModal}>
                    <button className={[cssModal.btn, 'btn-primary'].join(' ')} type="button" onClick={this.clickBoton}> Aceptar </button>
                    {/*<Boton tipo="error" icono={true} nombre="Salir" onClick={this.props.onClose}/>*/}
                </div>
            </div>
        </div>
        );
    }
}

export default ModalComponent;