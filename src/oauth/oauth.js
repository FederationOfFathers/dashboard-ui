import {inject} from 'aurelia-framework';
import {UserCache} from 'cache/user';
import {MemberMetaApi} from 'api/member-meta';

@inject(UserCache, MemberMetaApi,)
export class OAuth {

    constructor(userCache, memberMetaApi) {
        this._userCache = userCache;
        this._memberMetaApi = memberMetaApi;
        this._message = "Please wait..."
    }

    activate(data) {
        switch(data.service) {
            case "youtube":
                this.youtubeOAuth()
                break;
            default:
                return;
        }
    }

    /* YouTube API authentication should be opened in a new window, redirected to this endpoint, then closed */
    youtubeOAuth(){
        let memberId = this._userCache.user.id;
        let ytToken = this.parseTokenFromLocation();
        let ytMeta = {
            "ytAccessToken" : ytToken
        }

        this._memberMetaApi.set(memberId, ytMeta);
        this._message = "Authenticated with Google/YouTube. Please close this window."

        window.close();
    }

    parseTokenFromLocation() {
        if (location.href.indexOf("?") > -1){
            let queryString = location.href.split("?")[1];
            if (queryString != null && queryString.indexOf('access_token') > -1) {
                let params = queryString.split("&");

                for (let param of params) {
                    let splitParam = param.split("=");
                    let key = splitParam[0];
                    let val = splitParam[1];
                    if (key = "access_token") {
                        return val;
                    }
                }
            }
        }

    }
}
