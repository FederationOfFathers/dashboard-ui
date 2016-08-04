import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";

@inject(HttpClient)
export class Hello {
 
        @bindable loginPending=1;
        @bindable loginAnonymous=0;
        @bindable loginAuthenticated=0;

        constructor(http) {
                this.client = http;
                this.client.configure(config => {
                        config
                        .withBaseUrl('/api/v0/')
                        .withDefaults({
                                credentials: 'same-origin',
                                headers: {
                                        'Cookie': document.cookie
                                }
                        })
                });
                this.client.fetch("ping")
                        .then(data => {
                                if ( data.status > 299 || data.status < 200 ) {
                                        this.loginAnonymous = 1;
                                } else {
                                        this.loginAuthenticated = 1;
                                }
                                this.loginPending = 0;
                        }).bind(this);
        }

        sayHello() {
        alert(`Hello ${this.firstName} ${this.lastName}. Nice to meet you.`);
        }
}
