import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {GroupsApi} from 'api/groups';
import {ChannelCache} from 'cache/channels';

@inject(Router, GroupsApi, ChannelCache)
export class ModifyChannel{

    constructor(router, groupsApi, channelCache){
        this._router = router;
        this._groupsApi = groupsApi;
        this._channelCache = channelCache;
        this.busy = false;

        
        this.channel = {};
    }

    activate(data){
        //Need to ensure that channelCache has been loaded
        console.log(data);
        this.back.href = data.originator;
        this.channel = this._channelCache.getById(data.id);
        console.log(this.channel);
    }

    back(){
        this._router.navigateBack();
    }

    get hidden() {
        return this.channel.visible;
    }
    set hidden(val){
        if(!this.busy){
            let originalValue = this.channel.visible;
            this.channel.visible = val;
            this.busy = true;
            this._groupsApi.visibility(this.channel.id, val)
                .then(result => {
                    this.busy = false;
                })
                .catch(err => {
                    this.busy = false;
                    console.error(err);
                    this.channel.visible = originalValue;
                });
        }
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
