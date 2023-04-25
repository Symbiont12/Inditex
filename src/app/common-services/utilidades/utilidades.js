export default class Utilidades{

    /**@desc {FORMATEAR_TIPO_PALABRA} */
    static cambiarNombreAtributos(response) {
        let arreglado =  response.map( (data,i) => {
            data['img'] = data["im:image"];
            data['artist'] = data["im:artist"];
            data['contentType'] = data["im:contentType"];
            data['name'] = data["im:name"];
            data['price'] = data["im:price"];
            data['releaseDate'] = data["im:releaseDate"];
            delete data["im:image"];
            delete data["im:artist"];
            delete data["im:contentType"];
            delete data["im:name"];
            delete data["im:price"];
            delete data["im:releaseDate"];
            return data;
          });
          return arreglado
    }

    /**@desc {Comprobar_Diferencia_Dias} */
    static comprobarDias (fechaActual) {
        let fechaLocal = new Date (localStorage.getItem("fecha"));
        let diferencia = fechaActual.getTime() - fechaLocal.getTime();
        return diferencia / 1000 / 60 / 60 / 24;
    }

    
}