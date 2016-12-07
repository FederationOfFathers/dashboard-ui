import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Router} from 'aurelia-router';

import {GroupsApi} from 'api/groups';
import {ChannelsApi} from 'api/channels';
import {UserCache} from 'cache/user';
import {ChannelCache} from 'cache/channels';
import {ChannelActionPrompt} from 'channels/channel-action-prompt';


@inject(GroupsApi, ChannelsApi, UserCache, ChannelCache, DialogService, Router)
export class AllChannels {

        constructor(groupsApi, channelsApi, userCache, channelCache, dialogService, router){
                this._groupsApi = groupsApi;
                this._channelsApi = channelsApi;
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
        }

        joinChannel(channel) {
                let request;
                let prevState = channel.member;
                channel.member = true;

                if(channel.type == 'Group'){
                        request = this._groupsApi.join(channel.id);
                } else if (channel.type == 'Channel'){
                        request = this._channelsApi.join(channel.id);
                }

                return request.then(response => {
                        this._userCache.myChannels.push(channel);
                })
                .catch(err => {
                        channel.member = prevState;
                        console.error(err)
                });
        }
        leaveChannel(channel){
                let request;
                let prevState = channel.member;

                if(channel.type == 'Group'){
                        request = this._groupsApi.leave(channel.id);
                } else if (channel.type == 'Channel'){
                        request = this._channelsApi.leave(channel.id);
                }
         
                channel.member = false;
                return request.then(response => {
                        //this._channelCache.update()//TODO: Don't think this is needed...
                })
                .catch(err => {
                        channel.member = prevState;
                        console.error(err)
                });
        }

        modifyChannel(channel){
                //TODO: if Admin, then show channel controls
                console.log(channel);
                // let details = { 
                //         title: 'Join Channel', 
                //         body: `Are you sure you want to join the channel <mark>${channel.name}</mark>?`,
                //         confirm: 'Join',
                //         channel: channel,
                //         admin: this.user.admin
                // };
                // this.dialogService.open({ viewModel: ChannelActionPrompt, model: details}).then(response => {
                //         console.log(response);
                //         if (!response.wasCancelled) {
                //                 console.log('good - ', response.output);
                //                 switch(response.output){
                //                         case "modify":
                //                                 //let routerParams = this.router.routes.find(x => x.name === 'modifyChannel');
                //                                 //routerParams.data = channel;
                //                                 this._router.navigate(`${channel.id}`);  
                //                                 break;
                //                         case "join":
                //                                 this.joinChannel(channel.id);
                //                                 break;
                //                 }
                //         } else {
                //                 console.log('bad');
                //         }
                //         console.log(response.output);
                // });
                return true;
        }

        toggleChannelState(channel, event){
                console.log('modifying channel state');
                if(channel.member){ //Going to leave
                        let details = { 
                                title: 'Leave Channel', 
                                body: `Are you sure you want to leave the channel <mark>${channel.name}</mark>?`,
                                confirm: 'Leave',
                                channel: channel
                        };
                        this.dialogService.open({ viewModel: ChannelActionPrompt, model: details}).then(response => {
                                console.log(response);
                                if (!response.wasCancelled) {
                                        if(response.output == "confirm"){//Bye Felicia
                                                this.leaveChannel(channel);
                                        }
                                } else {
                                        console.log('Canceled');
                                }
                                console.log(response.output);
                        });
                } else { //Going to join
                        this.joinChannel(channel);
                }
                event.stopPropagation();
                return false;
        }

        get user(){
                return this._userCache.get();
        }
        get channels(){
                return this._channelCache.channels;
        }

}
