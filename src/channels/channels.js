import {inject} from 'aurelia-framework';


import {GroupsApi} from 'api/groups';
import {UserCache} from 'cache/user';
import {ChannelCache} from 'cache/channels';

@inject(GroupsApi, UserCache, ChannelCache)
export class Channels {

    constructor(groupsApi, userCache, channelCache){
            this._groupsApi = groupsApi;
            this._userCache = userCache;
            this._channelCache = channelCache;
    }

    activate(){
        //TODO: improve this so it's not a blocking action
        return this._channelCache.update();
    }

    configureRouter(config, router) {
        this.router = router;
        config.title = 'Channels';
        config.map([
            // {route: '', redirect: 'myChannels'}, //This seems to be causing non-critical but still apparent error in the console
            {
                route: [':id'],
                name: 'modifyChannel',
                moduleId: 'channels/modify-channel/modify-channel',
                nav: false,
                title: 'Modify Channel',
                settings: {
                    roles: ["user"]
                }
            },
            {
                route: ['','myChannels'],
                name: 'myChannels',
                moduleId: 'channels/my-channels/my-channels',
                nav: false,
                title: 'My Channels',
                settings: {
                    roles: ["user"]
                }
            }, 
            {
                route: ['allChannels'],
                name: 'allChannels',
                moduleId: 'channels/all-channels/all-channels',
                nav: false,
                title: 'All Channels',
                settings: {
                    roles: ["user"]
                }
            }
        ]);
    }
}
