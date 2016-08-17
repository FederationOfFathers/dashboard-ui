import {HttpClient} from 'aurelia-fetch-client';
var baseURL = '/api/v0/'
if ( window.location.hostname == "localhost" ) {
        baseURL = 'http://fofgaming.com:8867/api/v0/'
}
let client = new HttpClient();
client.configure(config => {
        config
        .withBaseUrl(baseURL)
        .withDefaults({
                credentials: 'include'
        })
});
export var Client = client;
