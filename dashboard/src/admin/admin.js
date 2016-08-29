import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';

@inject(UserCache)
export class Admin{
    constructor(userCache){
        this.userCache = userCache;  
        this.user = this.userCache.get();     
    }
    activate(){
       
    }

    get isAdmin(){
        return this.user.admin;
    }
    get stringifiedUser(){
        return JSON.stringify(this.user.user);
    }
}
