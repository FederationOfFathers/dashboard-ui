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
}