import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';

@inject(UserCache)
export class AdminPortal{
    constructor(userCache){
        this.userCache = userCache;
    }
}