import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';
import {MemberMetaApi} from 'api/member-meta';
import {Api} from 'api/api';

@inject(UserCache, MemberMetaApi, Api)
export class OAuth {

    constructor(userCache, memberMetaApi, api) {
        this._userCache = userCache;
        this._memberMetaApi = memberMetaApi;
        this._api = api;
        this._message = "Please wait..."
    }

    activate(data) {
        this.memberId = this._userCache.user.id;
        switch(data.service) {
            case "youtube":
                this.youtubeOAuth();
                break;
            case "twitch":
                this.twitchOAuth();
                break;
            case "battlenet":
                this.battlenetOAuth();
                break;
            default:
                return;
        }
    }

    battlenetOAuth() {
            let auth_code = this.parseTokenFromLocation("code");
            let resp = this._api.get("oauth/battlenet?auth_code=${auth_code}");
            this._message = "Authenticated with Blizzard/Battle.net. Please close this window."
            window.close();
    }

    /* YouTube API authentication should be opened in a new window, redirected to this endpoint, then closed */
    youtubeOAuth(){

        let ytToken = this.parseTokenFromLocation("access_token");
        let ytMeta = {
            "ytAccessToken" : ytToken
        }

        this._memberMetaApi.set(this.memberId, ytMeta);
        this._message = "Authenticated with Google/YouTube. Please close this window."

        window.close();
    }

    twitchOAuth() {
        let token = this.parseTokenFromLocation("access_token");
        let metaData = {
            "twitchAccessToken" : token
        }

        this._memberMetaApi.set(this.memberId, metaData);
        this._message = "Authenticated with Twitch. Please close this window."

        window.close();

    }

    parseTokenFromLocation(tokenName) {
        if (location.href.indexOf("?") > -1){
            let queryString = location.href.split("?")[1];
            if (queryString != null && queryString.indexOf(tokenName) > -1) {
                let params = queryString.split("&");

                for (let param of params) {
                    let splitParam = param.split("=");
                    let key = splitParam[0];
                    let val = splitParam[1];
                    if (key = tokenName) {
                        return val;
                    }
                }
            }
        }

    }
}
