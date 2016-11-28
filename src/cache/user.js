export class UserCache{
    constructor(){
        this._user;
    }

    set(userInfo){
        this._user = userInfo;
    }
    get(){
        return this._user;
    }
    get myChannels(){
        return this._user.groups
    }
}