import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {MemberMetaApi} from 'api/member-meta';
import {Api} from 'api/api';
import environment from '../environment';

const BNET_AUTH_URL = "https://us.battle.net/oauth/authorize";
const BNET_TOKEN_URI = "https://us.battle.net/oauth/token";

@inject(Api, MemberMetaApi)
export class BattleNetApi {

    constructor(api, memberMetaApi) {
        this.api = api;
        this.memberMetaApi = memberMetaApi;
        this.oAuth_client_id = environment.battlenetClientId;
        this.redirect_url = "http://" + environment.host + "/oauth/battlenet";
    }

    connect(memberId){
        let thisApi = this;
        return new Promise(function(resolve, reject) {
            thisApi._memberId = memberId;
            // redirect to get auth code
            let oAuthWindow = thisApi.redirectToOAuth();
            // wait for OAuth window to be closed and get access token
            var timer = setInterval(function(){
                if(oAuthWindow.closed) {
                    clearInterval(timer);
                    thisApi.memberMetaApi.get(thisApi._memberId, "bnet_auth_code").then(function(metaObj){
                        let code = metaObj.bnet_auth_code;

                        thisApi.getAccessToken()

                    });
                }
            }, 500);
        }).bind(this);

    }

    cleanUpToken(token) {
        // $.post(TWITCH_TOKEN_REVOKE_URL, {"client_id" : this.oAuth_client_id, "token" : token});
        // this.memberMetaApi.delete(this._memberId, "twitchAccessToken");
    }

    getAccessToken(auth_code) {
        let thisApi = this;
        this.api.get("oauth/battlenet/access_token").then(function(data){
            this.memberMetaApi.set(thisApi._memberId, {"bnet_access_token" : data.access_token})
        });
    }


    redirectToOAuth() {
        let oAuthUrl = BNET_AUTH_URL + "?client_id=" + this.oAuth_client_id +
                    "&redirect_uri=" + this.redirect_url +
                    "&response_type=code" +
                    "&force_verify=true";
                    // TODO generate a state for more secure transactions
                    //"&state=some_string_to_validate_later"
        return window.open(oAuthUrl, "Blizzard OAuth");
    }
}
