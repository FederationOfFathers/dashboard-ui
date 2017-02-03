import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class StreamsApi {

    constructor(api){
        this.api = api;
    }

    get(slackID){
        if(slackID){
            return this.api.get("streams/${slackID}");
        } else {
            return this.api.get("streams");
        }
    }

    delete(slackID, type){
        return this.api.delete("streams/${slackID}/${type}");
    }

    set(slackID, key, type, id){
        return this.api.post("streams")
    }
}
