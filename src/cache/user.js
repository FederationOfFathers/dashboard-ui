import {inject} from 'aurelia-framework';

import {UserApi} from 'api/user';

@inject(UserApi)
export class UserCache{
    constructor(userApi){
        this._userApi = userApi;
        this._user;
        this._myChannels;
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
        this._myChannels = this._user.groups.concat(this._user.channels).sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        });
    }
    get(){
        return this._user;
    }
    get myChannels(){
        return this._myChannels;
    }
}