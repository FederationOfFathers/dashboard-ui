
import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';


@inject(UserCache)
export class Groups {

    join(groupID) {
            fetch(
                    'http://fofgaming.com:8867/api/v0/groups/'+groupID+'/join',
                    {credentials: 'include'}
            ).then(function(rsp){
                    this.update()
            }.bind(this))
    }
    
    visibility(groupID, visibility) {
            var formData = new FormData();
            formData.append("visible", visibility)
            // TODO: CORS on the API side...
            fetch(
                    'http://fofgaming.com:8867/api/v0/groups/'+groupID+'/visibility',
                    {
                            method: 'PUT',
                            body: formData,
                            credentials: 'include'
                    }
            ).then(function(rsp) {
                    this.update()
            }.bind(this))
    }

    setVisible(groupID) {
            this.visibility(groupID, "true")
    }

    setHidden(groupID) {
            this.visibility(groupID, "false")
    }

    groups() {
            if ( this.public_groups === undefined ) {
                    return []
            }
            return this.public_groups
    }

    update() {
        fetch(
                'http://fofgaming.com:8867/api/v0/groups', 
                {credentials: 'include'}
        ).then(function(rsp){
                return rsp.json()
        }).then(function(data) {
            var groups = []
            for( var key in data ) {
                data[key].member = false
                for( var g in this.user.groups ) {
                        if ( this.user.groups[g].id !== data[key].id ) {
                           continue
                        }
                        data[key].member = true
                        break
                } 
                groups.push(data[key])
            }
            this.public_groups = groups
        }.bind(this))
    }

    constructor(userCache){
            this.userCache = userCache;  
            this.user = this.userCache.get();     
            this.update()
    }
}
