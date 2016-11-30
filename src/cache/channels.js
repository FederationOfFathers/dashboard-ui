import {inject} from 'aurelia-framework';

import {UserCache} from 'cache/user';
import {GroupsApi} from 'api/groups';

@inject(UserCache, GroupsApi)
export class ChannelCache{
    constructor(userCache, groupsApi){
        this._userCache = userCache;
        this._groupsApi = groupsApi;
        this._channels = [];
    }

    getById(id){
        return this.channels.find(channel => channel.id == id);
    }
    update(){
        return this._groupsApi.get()
                .then(channels => {
                        this.channels = channels;
                })
    }

    set channels (channels){
        this._channels = [];
        for (let key in channels){
            this._channels.push(channels[key]);
        }
        this._channels.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        });
        //TODO: ASAP: Create a channel model to use to unify channel/group object structure
         console.log(this._channels);
         console.log(this._userCache.myChannels);
    }
    get channels(){
        return this._channels;
    }
    get myChannels(){
        return this._userCache.myChannels;
    }
}
