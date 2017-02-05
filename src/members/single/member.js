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
            twitch: "",
            beam: "",
        }
        this.streams_original = {
            twitch: "",
            beam: "",
        }
        this.updating = {
            twitch: false,
            beam: false,
        }
    }

    editable() {
        if ( this._user === null ) {
            return false
        }
        if ( this._user.Id === this._userCache.user.id || this._userCache.user.is_admin ) {
            return true
        }
        return false
    }

    setStream(kind) {
        this.updating[kind] = true
        this._streamsApi.set(
            this._user.Id,
            kind,
            this.streams[kind].replace(/^\s*(https?:\/\/)?(beam\.pro|(www\.)?twitch\.tv)(\/*)?/i, ""))
        .then(function(){
            this.updating[kind] = false
            this.streams_original[kind] = this.streams[kind]
        }.bind(this))
        .catch(function() {
            this.updating[kind] = false
            window.alert("error updating " + kind + " please try again later")
        }.bind(this))
    }

    activate(data){
        if ( typeof data.name == 'undefined' ) {
            this._router.navigate('members/' + this._userCache.user.name)
            return false
        }
        this._channels = []
        this._name = data.name
        this._lcName = data.name.toLowerCase()
        this.streams.beam = ""
        this.streams.twitch = ""
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
                this._streamsApi.get(this._user.Id).then(function(s) {
                        this.streams_original.beam = s.Beam
                        this.streams_original.twitch = s.Twitch
                        this.streams.beam = s.Beam
                        this.streams.twitch = s.Twitch
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
