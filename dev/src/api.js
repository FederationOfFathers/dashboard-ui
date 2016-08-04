import {HttpClient} from 'aurelia-fetch-client';
let client = new HttpClient();
client.configure(config => {
        config
        .withBaseUrl('/api/v0/')
        .withDefaults({
                credentials: 'same-origin',
                headers: {
                        'Cookie': document.cookie
                }
        })
});
export var Client = client;
