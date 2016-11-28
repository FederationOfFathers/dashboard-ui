import {inject} from 'aurelia-framework';

import {UserCache} from 'cache/user';

@inject(UserCache)
export class ChannelCache{
    constructor(userCache){
        this._userCache = userCache;
        this._channels = [];
        this._myChannels = [];
    }

    set channels (channels){
        this._channels = [];
        for (let key in channels){
            this._channels.push(channels[key]);
        }
        this._channels.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        })
        console.log(this._channels);
    }
    get channels(){
        return this._channels;
    }
    get myChannels(){
        return this._channels;
    }
}
