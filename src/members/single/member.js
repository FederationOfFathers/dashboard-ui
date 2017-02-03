// vim: ai:ts=4:sw=4
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ChannelCache} from 'cache/channels';
import {UserCache} from 'cache/user';
import {UsersCache} from 'cache/users';
import {StreamsApi} from 'api/streams';

@inject(Router, ChannelCache, UserCache, UsersCache, StreamsApi)
export class Member{

    constructor(router, channelCache, userCache, usersCache, streamsApi){
        this._router = router;
        this._channelCache = channelCache;
        this._userCache = userCache;
        this._usersCache = usersCache
        this._streamsApi = streamsApi
        this._gts = []
        this._lookup = {
            gt: {},
            name: {},
            id: {}
        }
        this._names = []
        this._user = null
        this._channels = []
        this.streams = {
            twitch: "t",
            beam: "b",
        }
    }

    editable() {
        if ( this._user.Id === this._userCache.user.id || this._userCache.user.is_admin ) {
            return true
        }
        return false
    }

    setStream(kind, id) {
    }

    activate(data){
        if ( typeof data.name == 'undefined' ) {
            this._router.navigateToRoute('members', {name: this._userCache.user.name})
            return
        }
        this._name = data.name
        this._lcName = data.name.toLowerCase()
        return this._usersCache.initialize().then(function() {
            this._usersCache.users.forEach(function(user) {
                if ( user.Name.toLowerCase() == this._lcName ) {
                    this._user = user
                }
                this._names.push(user.Name)
                this._gts.push(user.GamerTag)
                this._lookup.gt[user.GamerTag] = user
                this._lookup.name[user.Name] = user
                this._lookup.id[user.Id] = user
            }.bind(this))
            if ( this._user === null ) {
                this._router.navigateToRoute('members', {name: this._userCache.user.name})
            } else {
                this._streamsApi.get(this._user.ID).then(function(s) {
                    if ( s.length > 0 ) {
                        this.streams.beam = s[0].Beam
                        this.streams.twitch = s[0].Twitch
                    }
                }.bind(this));
            }
            return this._channelCache.update().then(function() {
                this._channelCache.channels.forEach(function(channel) {
                    if (!channel.members.includes(this._user.Name)) {
                        return;
                    }
                    if ( channel.visible === "false" && !channel.members.includes(this._userCache.user.Name) ) {
                        return;
                    }
                    this._channels.push(channel)
                }.bind(this))
            }.bind(this))
        }.bind(this))
    }

}
