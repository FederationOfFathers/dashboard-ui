import {Client} from 'api.js';

export class User {

        constructor() {
                this.loggedOut=false;
                this.loggedIn=false;
                this.data = null;
                this.groups = [];
                this.channels = [];
                this.api = Client;
                
                this.api.fetch("ping")
                        .then(data => {
                                if ( data.status > 299 || data.status < 200 ) {
                                        this.loggedOut = true;
                                        this.loginPending = false;
                                } else {
                                        data.json().then(response => {
                                                this.loggedIn = true;
                                                this.loginPending = false;
                                                this.data = response.user;
                                                this.groups = response.groups;
                                                this.channels = response.channels;
                                        })
                                }
                        }).bind(this)
        }

        cb() {
                if ( this.doCallback !== undefined ) {
                        this.doCallback(this)
                }
        }

}

