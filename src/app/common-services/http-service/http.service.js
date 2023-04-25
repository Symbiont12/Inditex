import HttpFetch from './http.fetch';
import LoadingService from '../../common-components/loading/loading.service';

export default class HttpService {

    static get(url) {
        levantarLoading();
        return new Promise((resolve, reject) => {
            HttpFetch.get(url).then((response) => {
                resolve(response.json());
                ocultarLoading();
            })
            .catch((error) => {
                console.log(error);
                reject(error);
                ocultarLoading();
            });
        })
    }

    static post(url, modelo) {
        levantarLoading();
        return new Promise((resolve, reject) => {
            HttpFetch.post(url, modelo).then((response) => {
                let status = response.status;
                if (status == '200') {
                    resolve(response.json());
                    ocultarLoading();
                } else {
                    if (response.json) {
                        response.json().then((error) => {
                            ocultarLoading();
                            reject(error);
                        })
                    } else {
                        reject(response);
                    }
                }
            })
            .catch((error) => {
                if (error.json) {
                    error.json().then(e => {
                        ocultarLoading();
                        reject(e)
                    });
                } else {
                    ocultarLoading();
                    reject(error);
                }
            })
        });
    }
}

HttpService.contador = 0;

function levantarLoading() {
    if (HttpService.contador === 0) {
        LoadingService.open();
    }
    HttpService.contador++;
}

function ocultarLoading() {
    HttpService.contador--;
    if (HttpService.contador === 0) {
        LoadingService.close();
    }
}