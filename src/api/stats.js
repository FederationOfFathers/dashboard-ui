import {inject} from 'aurelia-framework';
import {Api} from './api';

@inject(Api)
export class StatsApi {
    constructor(api){
        this.api = api;
    }

    getCategories(){
        return this.api.get("xhr/stats/v1/stats.json");
    }
    getById(id){
        return this.api.get(`xhr/stats/v1/s/${id}.json`);
    }
}