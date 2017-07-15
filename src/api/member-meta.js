import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class MemberMetaApi {

    constructor(api){
        this.api = api;
    }

    get(slackID, metaKey){
        if(slackID && metaKey){
            return this.api.get("meta/member/" + slackID + "/" + metaKey);
        } else if (slackID){
            return this.api.get("meta/member/" + slackID);
        } else {
            return null;
        }
    }

    delete(slackID, metaKey){
        this.api.delete("meta/member/" + slackID + "/" + metaKey);
    }

    set(slackID, metaData){
        return this.api.put("meta/member/" + slackID, metaData);
    }
}
