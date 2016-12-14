import {inject} from 'aurelia-framework';

import {UserApi} from 'api/user';

@inject(UserApi)
export class UserCache{
    constructor(userApi){
        this._userApi = userApi;
        this._user;
        this.myChannels;

    }

    update(){
        return this._userApi.ping()
                .then(user => {
                        this.set(user);
                        console.log(user);
                });
    }

    set(userInfo){
        this._user = userInfo;
        this.myChannels = this._user.groups
            .map(g => {
                g.type = "Group"; 
                g.visible = g.visible ? g.visible.toString() : "false";
                return g;
            })
            .concat(this._user.channels.map(c => {
                c.type = "Channel"; 
                c.visible = "true"; //All channels are open
                return c;
            }))
            .sort((a, b) => {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            });        

    }
    get(){
        //TODO: phase this call out
        return this._user;
    }
    get user(){
        return this._user ? this._user.user : {};
    }
}