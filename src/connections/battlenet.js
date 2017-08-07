import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {MemberMetaApi} from 'api/member-meta';
import {Api} from 'api/api';
import environment from '../environment';

const BNET_AUTH_URL = "https://us.battle.net/oauth/authorize";
const BNET_TOKEN_URI = "https://us.battle.net/oauth/token";
const BNET_ACCOUNT_URL = "https://us.api.battle.net/account/user";

@inject(Api, MemberMetaApi)
export class BattleNetApi {

    constructor(api, memberMetaApi) {
        this.api = api;
        this.memberMetaApi = memberMetaApi;
        this.oAuth_client_id = environment.battlenetClientId;
        // This MUST use https, even on local testing. poop.
        this.redirect_url = "https://" + environment.host + "/oauth/battlenet";
    }

    connect(memberId){
        let thisApi = this;
        return new Promise(function(resolve, reject) {
            thisApi._memberId = memberId;
            // get stae and redirect to get auth code
            thisApi.api.get("oauth/battlenet/state").then(function(stateObj){
                var oAuthWindow = thisApi.redirectToOAuth(stateObj.state);
                // wait for OAuth window to be closed and get access token
                if (oAuthWindow == null) {
                    return;
                }
                var timer = setInterval(function(){
                    if(oAuthWindow.closed) {
                        clearInterval(timer);
                        thisApi.memberMetaApi.get(thisApi._memberId, "bnet_username").then(function(metaObj){
                            resolve(metaObj);
                        });
                    }
                }, 500);
            });

        }).bind(this);

    }

    redirectToOAuth(state) {
         let oAuthUrl = BNET_AUTH_URL + "?client_id=" + this.oAuth_client_id +
                     "&redirect_uri=" + encodeURIComponent(this.redirect_url) +
                     "&response_type=code" +
                     "&state=" + state;
         return window.open(oAuthUrl, "Blizzard OAuth");
    }
}
