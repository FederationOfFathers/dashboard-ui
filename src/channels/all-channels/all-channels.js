import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Router} from 'aurelia-router';

import {GroupsApi} from 'api/groups';
import {UserCache} from 'cache/user';
import {ChannelCache} from 'cache/channels';
import {ChannelActionPrompt} from 'channels/channel-action-prompt';


@inject(GroupsApi, UserCache, ChannelCache, DialogService, Router)
export class AllChannels {

    constructor(groupsApi, userCache, channelCache, dialogService, router){
            this._groupsApi = groupsApi;
            this._userCache = userCache;
            this._channelCache = channelCache;
            this._router = router;
            this.dialogService = dialogService;
            this.query = "";
            this.back = {
                    title: 'Back',
                    href: '#/channels/myChannels'
            }
    }

    activate(){
        //     this._groupsApi.get()
        //         .then(channels => {
        //                 this.channels = channels;
        //         })
    }

     joinChannel(id) {
             return this._groupsApi.join(id)
                .then(response => {
                        this._channelCache.update();//TODO: Don't think this is needed...
                })
                .catch(err => {
                        console.error(err)
                });
    }

    modifyChannel(channel){
        //TODO: if Admin, then show channel controls
        console.log(channel);
        let details = { 
                title: 'Join Channel', 
                body: `Are you sure you want to join the channel <mark>${channel.name}</mark>?`,
                confirm: 'Join',
                channel: channel,
                admin: this.user.admin
        };
        this.dialogService.open({ viewModel: ChannelActionPrompt, model: details}).then(response => {
                console.log(response);
                if (!response.wasCancelled) {
                        console.log('good - ', response.output);
                        switch(response.output){
                                case "modify":
                                        //let routerParams = this.router.routes.find(x => x.name === 'modifyChannel');
                                        //routerParams.data = channel;
                                        this._router.navigate(`${channel.id}`);  
                                        break;
                                case "join":
                                        this.joinChannel(channel.id);
                                        break;
                        }
                } else {
                        console.log('bad');
                }
                console.log(response.output);
        });
        return false;
    }

    get user(){
            return this._userCache.get();
    }
    get channels(){
            return this._channelCache.channels;
    }

}
