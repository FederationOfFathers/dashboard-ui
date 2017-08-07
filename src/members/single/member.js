// vim: ai:ts=4:sw=4
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ChannelCache} from 'cache/channels';
import {UserCache} from 'cache/user';
import {UsersCache} from 'cache/users';
import {StreamsApi} from 'api/streams';
import {MemberMetaApi} from 'api/member-meta';
import {YoutubeApi} from 'connections/youtube';
import {TwitchApi} from 'connections/twitch';
import {BattleNetApi} from 'connections/battlenet'

@inject(Router, ChannelCache, UserCache, UsersCache, StreamsApi, MemberMetaApi, YoutubeApi, TwitchApi, BattleNetApi)
export class Member{

    constructor(router, channelCache, userCache, usersCache, streamsApi, memberMetaApi, youtubeApi, twitchApi, battleNetApi){
        this._router = router;
        this._channelCache = channelCache;
        this._userCache = userCache;
        this._usersCache = usersCache
        this._editable = false
        this._streamsApi = streamsApi
        this._memberMetaApi = memberMetaApi
        this._youtubeApi = youtubeApi;
        this._twitchApi = twitchApi;
        this._battleNetApi = battleNetApi;
        this._gts = []
        this._lookup = {
            gt: {},
            name: {},
            id: {}
        }
        this.meta = {
            gt_xbox: "",
            gt_psn: "",
            steam: "",
            bnet: "",
            facebook: "",
            twitter: ""
        }
        this.meta_original = this.meta
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
        this._navUsername = ""
        this._userList = []
    }

    enableStreamEdit() {
        if (this._editable) {
            this._streamEditEnabled = true
        }
    }

    disableStreamEdit() {
        this._streamEditEnabled = false
        this.streams = this.streams_original
    }

    enableMetaEdit() {
        if (this._editable) {
            this._metaEditEnabled = true
        }
    }

    disableMetaEdit() {
        this.meta = this.meta_original
        this._metaEditEnabled = false
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

    setMemberMeta() {
        let metaJson = {};
        metaJson.gt_xbox = this.meta.gt_xbox;
        metaJson.gt_psn = this.meta.gt_psn;
        metaJson.steam = this.meta.steam;
        metaJson.bnet = this.meta.bnet;

        this._memberMetaApi.set(this._user.Id, metaJson)
        .then(function() {
            this.meta_original = this.meta;
            this._metaEditEnabled = false;
        }.bind(this))
        .catch(function() {

        }.bind(this))

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

    navigateTo() {
        this._router.navigate('members/' + this._navUsername)
    }

    activate(data){
        if ( typeof data.name == 'undefined' ) {
            this._user = this._userCache.user.name
            this._router.navigate('members/' + this._userCache.user.name)
            return false
        }
        this._channels = []
        this._name = data.name
        this._lcName = data.name.toLowerCase()
        this._navUsername = this._lcName
        this.streams.beam = ""
        this.streams.twitch = ""
        this._streamEditEnabled = false
        this._metaEditEnabled = false
        return this._usersCache.initialize().then(function() {
            this._usersCache.users.forEach(function(user) {
                if ( user.Name.toLowerCase() == this._lcName ) {
                    this._user = user
                }
                if ( user.Name === "" || user.Name == "damnbot" || user.Name == "fofbot" || user.Name == "slackbot" ) {
                    return;
                }
                this._names.push(user.Name)
                this._gts.push(user.GamerTag)
                this._lookup.gt[user.GamerTag] = user
                this._lookup.name[user.Name] = user
                this._lookup.id[user.Id] = user
            }.bind(this))
            this._editable = this.editable();
            this._userList = Object.keys(this._lookup.name).sort()
            if ( this._user === null ) {
                this._router.navigateToRoute('members', {name: this._userCache.user.name})
            } else {
                this._streamsApi.get(this._user.Id).then(function(s) {
                        this.streams_original.beam = s.Beam
                        this.streams_original.twitch = s.Twitch
                        this.streams.beam = s.Beam
                        this.streams.twitch = s.Twitch
                }.bind(this));

                this.loadMetaValues()
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

    loadMetaValues(){
        this._memberMetaApi.get(this._user.Id).then(function(meta) {
            this.meta = meta;
            this.meta_original = meta;
        }.bind(this));
    }

    connectToYouTube() {
        let member = this;
        this._youtubeApi.connectToYouTube(member._user.Id).then(function(data){
            member.meta.youtube_id = data.youtube_id;
            member.meta.youtube_name = data.youtube_name;
        });
    }

    connectToTwitch() {
        let member = this;
        this._twitchApi.connect(member._user.Id).then(function(data){
            member.meta.twitch_name = data.twitch_name;
        })

    }
    connectToBlizzard() {
        let member = this;
        this._battleNetApi.connect(member._user.Id).then(function(data){
            member.meta.bnet = data.bnet_username;
        })
    }

    unlinkYoutube() {
        this._memberMetaApi.delete(this._user.Id, "youtube_id");
        this._memberMetaApi.delete(this._user.Id, "youtube_name");
        this.meta.youtube_id = "";
        this.meta.youtube_name = "";
    }

    unlinkTwitch() {
        this._memberMetaApi.delete(this._user.Id, "twitch_name");
        this.meta.twitch_name = "";
    }

}
