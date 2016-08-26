import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'whatwg-fetch';

import environment from '../environment';

let BASE_URL = '/api/v0/';
if (environment.debug){
    BASE_URL = 'http://fofgaming.com:8867/api/v0/';
}

@inject(HttpClient)
export class Api {
    constructor(http) {
        http.configure(config => {
            config
                .withBaseUrl(BASE_URL)
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
                            throw Error('Logged out: response ${response.status}');
                        }
                        return response;
                    }
                });
        });
        this.http = http;
    }

    get(url){
        return this.http.fetch(url)
            .then(response => {
                return response.json()
            })
    }
    put(url, payload){       
        //TODO: Test to make sure this works. Not tested yet
        var data = new FormData();
        data.append( "json", JSON.stringify( payload ) );
        return this.http.fetch(url,
            {
                method: "put",
                body: data
            })
            .then(response => {
                return response.json()
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