import {inject} from 'aurelia-framework';

import {UserCache} from 'cache/user';
import {GroupsApi} from 'api/groups';
import {ChannelsApi} from 'api/channels';

@inject(UserCache, GroupsApi, ChannelsApi)
export class ChannelCache{
    constructor(userCache, groupsApi, channelsApi){
        this._userCache = userCache;
        this._groupsApi = groupsApi;
        this._channelsApi = channelsApi;
        this._channels = [];
    }

    getById(id){
        return this.channels.find(channel => channel.id == id);
    }
    update(){
        return Promise.all([this._groupsApi.get(),this._channelsApi.get()])
                .then(values => {
                        for(let group in values[0]){
                            values[0][group].type = 'Group';
                        }
                        for(let channel in values[1]){
                            values[1][channel].type = 'Channel';
                        }
                        this.channels = Object.assign(values[0], values[1]);
                        //this.channels = this.channels.push(...values[1]);
                        console.log(this.channels);
                        console.log(values);
                        console.log(this.channels.map(c => c.name));
                });
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
    }
    get channels(){
        return this._channels;
    }
    get myChannels(){
        return this._userCache.myChannels;
    }
}
