import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Router} from 'aurelia-router';

import {GroupsApi} from 'api/groups';
import {ChannelsApi} from 'api/channels';
import {UserCache} from 'cache/user';
import {ChannelCache} from 'cache/channels';
import {ChannelActionPrompt} from 'channels/channel-action-prompt';

import toastr from "toastr";

@inject(GroupsApi, ChannelsApi, UserCache, ChannelCache, DialogService, Router)
export class MyChannels {

        constructor(groupsApi, channelsApi, userCache, channelCache, dialogService, router){
                this._groupsApi = groupsApi;
                this._channelsApi = channelsApi;
                this._userCache = userCache;
                this._channelCache = channelCache;
                this._router = router;
                this.dialogService = dialogService;
                this.query = "";
                this.more = {
                        title: 'All',
                        href: '#/channels/allChannels'
                }
        }

        activate(){
                this.channels = this._channelCache.myChannels;
        }

        modifyChannel(channel){
                //TODO: if Admin, then show channel controls
                console.log(channel);
                // let details = { 
                //         title: 'Leave Channel', 
                //         body: `Are you sure you want to leave the channel <mark>${channel.name}</mark>?`,
                //         confirm: 'Leave',
                //         channel: channel,
                //         modify: (this.user.admin && channel.type == "Group")
                // };
                // this.dialogService.open({ viewModel: ChannelActionPrompt, model: details}).then(response => {
                //         console.log(response);
                //         if (!response.wasCancelled) {
                //                 console.log('good - ', response.output);
                //                 if(response.output == 'modify'){
                //                         //let routerParams = this.router.routes.find(x => x.name === 'modifyChannel');
                //                         //routerParams.data = channel;
                //                         this._router.navigate(`${channel.id}`);   
                //                 }
                //         } else {
                //                 console.log('bad');
                //         }
                //         console.log(response.output);
                // });
                return true;
        }
  
        leaveChannel(channel){
                let request;
                if(channel.type == 'Group'){
                        request = this._groupsApi.leave(channel.id);
                } else if (channel.type == 'Channel'){
                        request = this._channelsApi.leave(channel.id);
                }
         
                channel.member = false;
                return request.then(response => {
                        //this._channelCache.update()//TODO: Don't think this is needed...
                        let channelIndex = this.channels.findIndex(c => c.id == channel.id);
                        this.channels.splice(channelIndex, 1);
                })
                .catch(err => {
                        if(err.message == "404"){
                                toastr.error("Seems you don't have permission to leave", "Failed to leave");
                        } else {
                                toastr.error("Hmmm, Something went wrong...", "Failed to leave");
                        }
                        console.error(err)
                });
        }

        toggleChannelState(channel, event){
                        console.log('modifying channel state');
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
                        event.stopPropagation();
                        return false;
                }

        
        
        get user(){
                return this._userCache.get();
        }


}
