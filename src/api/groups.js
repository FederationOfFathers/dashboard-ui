import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class GroupsApi {
    constructor(api){
        this.api = api;
    }

    get(){
        return this.api.get("groups");
    }
    join(id){
        return this.api.get("groups/${id}/join");
    }
    visibility(id){
        return this.api.put("groups/${id}/visibility");
    }
}