import {inject} from 'aurelia-framework';

import {UserCache} from 'cache/user';

@inject(UserCache)
export class ChannelCache{
    constructor(userCache){
        this._userCache = userCache;
        this._channels = [];
    }

    getById(id){
        return this.channels.find(channel => channel.id == id);
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
