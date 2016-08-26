import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class UserApi {
    constructor(api){
        this.api = api;
    }

    ping(){
        return this.api.get("ping");
    }
    login(){
        return this.api.get("login");
    }
    logout(){
        return this.api.get("logout");
    }
}