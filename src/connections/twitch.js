import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {MemberMetaApi} from 'api/member-meta';
import environment from '../environment';

const TWITCH_AUTH_URL = "https://api.twitch.tv/kraken/oauth2/authorize";
const TWITCH_USER_API = "https://api.twitch.tv/kraken/user";
const TWITCH_TOKEN_REVOKE_URL = "https://api.twitch.tv/kraken/oauth2/revoke";

@inject(MemberMetaApi)
export class TwitchApi {

    constructor(memberMetaApi) {
        this.memberMetaApi = memberMetaApi;
        this.oAuth_client_id = environment.twitchClientId;
        this.redirect_url = "http://" + environment.host + "/oauth/twitch";
    }

    connect(memberId){
        let thisApi = this;
        return new Promise(function(resolve, reject) {
            thisApi._memberId = memberId;
            let oAuthWindow = thisApi.redirectToOAuth();
            // let api = thisApi;
            // wait for OAuth window to be closed
            var timer = setInterval(function(){
                if(oAuthWindow.closed) {
                    clearInterval(timer);
                    thisApi.memberMetaApi.get(thisApi._memberId, "twitchAccessToken").then(function(metaObj){
                        let token = metaObj.twitchAccessToken;

                        thisApi.getTwitchUserData(token).then(function(data){
                            let accountData = {
                                "twitch_name" : data.name
                            };
                            thisApi.memberMetaApi.set(thisApi._memberId, accountData);
                            thisApi.cleanUpToken(token);
                            resolve(accountData);
                        });
                    });
                }
            }, 500);
        }).bind(this);

    }

    cleanUpToken(token) {
        $.post(TWITCH_TOKEN_REVOKE_URL, {"client_id" : this.oAuth_client_id, "token" : token});
        this.memberMetaApi.delete(this._memberId, "twitchAccessToken");
    }

    getTwitchUserData(token) {
        let thisApi = this;
        return new Promise(function(resolve, reject){
            let channels = [];
            $.ajax({
                url: TWITCH_USER_API + "?_=" + new Date().getTime(),
                headers: {
                    "Accept" : "application/vnd.twitchtv.v5+json",
                    "Authorization" : "OAuth " + token,
                    "Client-ID" : thisApi.oAuth_client_id
                }
            }).done(function(data){
                resolve(data);
            }).fail(function(jqXhr, status, error){
                reject("API Call failed: " + status);
            });
        });
    }

    redirectToOAuth() {
        let oAuthUrl = TWITCH_AUTH_URL + "?client_id=" + this.oAuth_client_id +
                    "&redirect_uri=" + this.redirect_url +
                    "&response_type=token" +
                    "&scope=user_read" +
                    "&force_verify=true";
                    // TODO generate a state for more secure transactions
                    //"&state=some_string_to_validate_later"
        return window.open(oAuthUrl, "Twitch OAuth");
    }
}
