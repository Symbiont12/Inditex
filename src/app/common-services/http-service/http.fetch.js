const appJSON = 'application/json';


export default class HttpFetch {

    static get(url){
        let status;
        return fetch(`https://api.allorigins.win/raw?url=${url}`, {
            method: 'GET', 
            headers: {'Accept': appJSON}
        }).then((response) => {
            status = response.status;
            return response;
        }).then((data) => {
            if (status === 200 && data){
                return data;
            }else{
                return Promise.reject(data ? data : '');
            }
        });
    }

    static post(url, modelo){
        let status;
        return fetch(`https://api.allorigins.win/raw?url=${url}`, {
            method: 'POST', 
            body: JSON.stringify(modelo), 
            headers: {'Accept': appJSON, 'Content-Type': appJSON}
        }).then((response) => {
            status = response.status;
            return (status === 500 || status < 400) ? response : Promise.reject(response.status + ' : ' + response.statusText);
        }).then((data) => {
            if (status === 200 && data){
                return data;
            }else{
                return Promise.reject(data ? data : '');
            }
        });
    }
}