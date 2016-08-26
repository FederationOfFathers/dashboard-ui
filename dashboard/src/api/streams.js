import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class StreamsApi {
    constructor(api){
        this.api = api;
    }

    get(key){
        if(key){
            return this.api.get("streams/${key}");
        } else {
            return this.api.get("streams");
        }
    }
    delete(key){
        return this.api.delete("streams/${key}");
    }

}