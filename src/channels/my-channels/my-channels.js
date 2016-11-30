import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Router} from 'aurelia-router';


import {GroupsApi} from 'api/groups';
import {UserCache} from 'cache/user';
import {ChannelCache} from 'cache/channels';
import {ChannelActionPrompt} from 'channels/channel-action-prompt';


@inject(GroupsApi, UserCache, ChannelCache, DialogService, Router)
export class MyChannels {

    constructor(groupsApi, userCache, channelCache, dialogService, router){
            this._groupsApi = groupsApi;
            this._userCache = userCache;
            this._channelCache = channelCache;
            this._router = router;
            this.dialogService = dialogService;
            this.query = "";
            this.more = {
                    title: 'More',
                    href: '#/channels/allChannels'
            }
    }

    activate(){
        //     this._groupsApi.get()
        //         .then(channels => {
        //                 this.channels = channels;
        //         })
    }

    modifyChannel(channel){
        //TODO: if Admin, then show channel controls
        console.log(channel);
        let details = { 
                title: 'Leave Channel', 
                body: `Are you sure you want to leave the channel <mark>${channel.name}</mark>?`,
                confirm: 'Leave',
                channel: channel,
                admin: this.user.admin
        };
        this.dialogService.open({ viewModel: ChannelActionPrompt, model: details}).then(response => {
                console.log(response);
                if (!response.wasCancelled) {
                        console.log('good - ', response.output);
                        if(response.output == 'modify'){
                                //let routerParams = this.router.routes.find(x => x.name === 'modifyChannel');
                                //routerParams.data = channel;
                                this._router.navigate(`${channel.id}`);   
                        }
                } else {
                        console.log('bad');
                }
                console.log(response.output);
        });
        return false;
    }

//     join(groupID) {
//             fetch(
//                     'http://fofgaming.com:8867/api/v0/groups/'+groupID+'/join',
//                     {credentials: 'include'}
//             ).then(function(rsp){
//                     this.update()
//             }.bind(this))
//     }
    
//     visibility(groupID, visibility) {
//             var formData = new FormData();
//             formData.append("visible", visibility)
//             // TODO: CORS on the API side...
//             fetch(
//                     'http://fofgaming.com:8867/api/v0/groups/'+groupID+'/visibility',
//                     {
//                             method: 'PUT',
//                             body: formData,
//                             credentials: 'include'
//                     }
//             ).then(function(rsp) {
//                     this.update()
//             }.bind(this))
//     }

//     setVisible(groupID) {
//             this.visibility(groupID, "true")
//     }

//     setHidden(groupID) {
//             this.visibility(groupID, "false")
//     }

//     groups() {
//             if ( this.public_groups === undefined ) {
//                     return []
//             }
//             return this.public_groups
//     }

//     update() {
//         fetch(
//                 'http://fofgaming.com:8867/api/v0/groups', 
//                 {credentials: 'include'}
//         ).then(function(rsp){
//                 return rsp.json()
//         }).then(function(data) {
//             var groups = []
//             for( var key in data ) {
//                 data[key].member = false
//                 for( var g in this.user.groups ) {
//                         if ( this.user.groups[g].id !== data[key].id ) {
//                            continue
//                         }
//                         data[key].member = true
//                         break
//                 } 
//                 groups.push(data[key])
//             }
//             this.public_groups = groups
//         }.bind(this))
//     }


    get user(){
            return this._userCache.get();
    }
    get channels(){
            return this._channelCache.myChannels;
    }
    set channels(channels){
            return this._channelCache.channels = channels;
    }

}
