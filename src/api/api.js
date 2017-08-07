import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'whatwg-fetch';

import environment from '../environment';

@inject(HttpClient)
export class Api {
    constructor(http) {
        this._baseUrl = this.initBaseUrl();
        http.configure(config => {
            config
                .withBaseUrl(this._baseUrl)
                .withDefaults({
                    credentials: 'include'
                })
                .withInterceptor({
                    request(request) {
                        console.log(`Intercepted request using method: ${request.method} with URL: ${request.url}`);
                        return request;
                    },
                    response(response) {
                        console.log(`Intercepted response ${response.status} using URL: ${response.url}`);
                        if (response.status > 299 || response.status < 200){
                            throw Error(`${response.status}`);
                        }
                        return response;
                    }
                });
        });
        this.http = http;
    }

    initBaseUrl() {
        let baseUrl = '/api/v0/';
        if (environment.apiBaseURL != undefined && environment.apiBaseURL != "") {
            baseUrl = environment.apiBaseURL;
        } else if (environment.debug){
            baseUrl = '//dev.dashboard.fofgaming.com/api/v0/';
        }
        return baseUrl;
    }

    get(url, responseType = 'json'){
        let time = new Date().getTime();
        let sep = url.indexOf("?") == -1 ? "?" : "&";
        return this.http.fetch(url + sep + "_=" + time)
            .then(response => {
                 switch(responseType.toLowerCase()){
                    case 'json':
                        return response.json();
                    case 'text':
                        return response.text();
                    default:
                        return response.json();
                }
            })
    }
    put(url, payload, responseType = 'text'){
        //TODO: Test to make sure this works. Not tested yet
        // var data = new FormData();
        // data.append( "json", JSON.stringify( payload ) );
        return this.http.fetch(url,
            {
                method: "put",
                body: JSON.stringify(payload),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(response => {
                switch(responseType.toLowerCase()){
                    case 'json':
                        return response.json();
                    default:
                        return response.text();
                }
            })
    }
    post(){
        throw Error('Not yet implemented');
    }
    delete(url){
        //TODO: Test to make sure this works. Not tested yet
        return this.http.fetch(url,
            {
                method: "delete",
            })
            .then(response => {
                return response.json()
            })
    }
}
