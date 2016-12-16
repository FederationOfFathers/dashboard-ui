import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {GroupsApi} from 'api/groups';
import {ChannelCache} from 'cache/channels';
import {UserCache} from 'cache/user';

@inject(Router, GroupsApi, ChannelCache, UserCache)
export class ModifyChannel{

    constructor(router, groupsApi, channelCache, userCache){
        this._router = router;
        this._groupsApi = groupsApi;
        this._channelCache = channelCache;
        this._userCache = userCache;
        this.busy = false;

        
        this.channel = {};
    }

    activate(data){
        //Need to ensure that channelCache has been loaded
        console.log(data);
        this.back.href = data.originator;
        this.channel = this._channelCache.getById(data.id);
        this._myChannel = this._channelCache.myChannels.find(m => m.id == data.id);
        console.log(this.channel);
    }

    back(){
        try {
            this._router.navigateBack();
        } catch(err){
            //Most likely refreshed page and we don't have a "back" to go to
            console.log(err);
            this._router.navigateTo('channels');
        }
    }

    get visible() {
        return this.channel.visible == "true";
    }
    set visible(isVisible){
        if(!this.busy){
            let originalVisibleValue = this.channel.visible;
            this.channel.visible = (isVisible).toString();
            if(this._myChannel){
                //This solves the double channel problem right now. Need to have one list of channels
                this._myChannel.visible = (isVisible).toString();
            }
            this.busy = true;
            this._groupsApi.visibility(this.channel.id, isVisible)
                .then(result => {
                    this.busy = false;
                })
                .catch(err => {
                    this.busy = false;
                    console.error(err);
                    this.channel.visible = originalVisibleValue;
                    if(this._myChannel){
                        this._myChannel.visible = originalVisibleValue;
                    }                        
                });
        }
    }
    get canChangeVisibility(){
        return this.channel.type == "Group" && this._userCache.get().admin;
    }
}

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
