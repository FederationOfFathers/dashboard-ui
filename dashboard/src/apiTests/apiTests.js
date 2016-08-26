import {inject} from 'aurelia-framework';
import {UserApi} from 'api/user';

@inject(UserApi)
export class ApiTests{
    constructor(userApi){
        this.UserApi = userApi;

        this.userProfile = {
            admin: false,
            channels: [],
            groups: [],
            user: {}
        };
    }
    activate(){
        this.UserApi.ping().then(data => {
            console.log(data);
            //TODO: User lodash or equivelant to merge data with defaults
            this.userProfile.admin = data.admin;
            this.userProfile.channels = data.channels;
            this.userProfile.groups = data.groups;
            this.userProfile.user = data.user;
        }).catch(err => {
            console.error(err)
        });
    }

    get isAdmin(){
        return this.userProfile.admin;
    }
    get stringifiedUser(){
        return JSON.stringify(this.userProfile.user);
    }
    get userChannels(){
        return this.userProfile.channels;
    }
    get userGroups(){
        return this.userProfile.groups;
    }
}