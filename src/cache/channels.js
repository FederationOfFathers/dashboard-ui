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

        this.myChannels = this._userCache.myChannels;
    }

    getById(id){
        return this.channels.find(channel => channel.id == id);
    }
    update(){
        return Promise.all([this._groupsApi.get(),this._channelsApi.get()])
                .then(values => {
                        for(let groupId in values[0]){
                            let group = values[0][groupId]
                            group.type = 'Group';
                            if (group.members.indexOf(this._userCache.user.name) > -1){
                                group.member = true;
                            }
                        }
                        for(let channelId in values[1]){
                            let channel = values[1][channelId]
                            channel.type = 'Channel';
                            if (channel.members.indexOf(this._userCache.user.name) > -1){
                                channel.member = true;
                            }
                        }
                        this.channels = Object.assign({}, values[0], values[1]);
                        //this.channels = this.channels.push(...values[1]);
                        // console.log(this.channels);
                        // console.log(values);
                        // console.log(this.channels.map(c => c.name));
                        return this.channels;
                });
    }

    set channels (channels){
        this._channels = [];
        for (let key in channels){
            //Admins can see everything
            //Members can see their own channels
            if ((!this._userCache.get().admin ? channels[key].visible == "true" : true) || channels[key].member){
                this._channels.push(channels[key]);
            }
        }
        this._channels.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        });
        //TODO: ASAP: Create a channel model to use to unify channel/group object structure
    }
    get channels(){
        return this._channels
    }
}
