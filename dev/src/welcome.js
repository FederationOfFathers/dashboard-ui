import {bindable} from "aurelia-framework";
import {User} from 'auth.js';

export class Hello {
        constructor() {
                this.loggedIn = false;
                this.loggedOut = false;
                this.loginPending = true;
                this.user = new User();
        }
}
