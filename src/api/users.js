import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class UsersApi {
    constructor(api){
        this.api = api;
    }

    
    getAll(){
        return this.api.get("xhr/users/v1/users.json");
    }
}