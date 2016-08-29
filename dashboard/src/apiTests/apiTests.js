import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';

@inject(UserCache)
export class ApiTests{
    constructor(userCache){
        this.userCache = userCache;
        this.user = userCache.get();
    }
    activate(){
        console.log(this.user);
    }

    get isAdmin(){
        return this.user.admin;
    }
    get stringifiedUser(){
        return JSON.stringify(this.user.user);
    }
    get userChannels(){
        return this.user.channels;
    }
    get userGroups(){
        return this.user.groups;
    }
}