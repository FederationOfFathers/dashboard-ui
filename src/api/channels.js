import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class ChannelsApi {
    constructor(api){
        this.api = api;
    }

    get(){
        return this.api.get("channels");
    }
    join(id){
        return this.api.get(`channels/${id}/join`, 'text');
    }
}