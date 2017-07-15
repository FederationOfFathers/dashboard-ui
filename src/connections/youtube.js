import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {MemberMetaApi} from 'api/member-meta'
import environment from '../environment';

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";
const YOUTUBE_READONLY_URL = "https://www.googleapis.com/auth/youtube.readonly";
const YOUTUBE_DATA_API_URL = "https://www.googleapis.com/youtube/v3";

@inject(MemberMetaApi)
export class YoutubeApi {

    constructor(memberMetaApi) {
        this.memberMetaApi = memberMetaApi;
        this.oAuth_client_id = environment.ytOauth;
        this.redirect_url = "http://" + environment.host + "/oauth/youtube";
    }

    connectToYouTube(memberId) {
        let thisApi = this;
        return new Promise(function(resolve, reject) {
            thisApi._memberId = memberId;
            let oAuthWindow = thisApi.redirectToGoogleOAuth();
            let yt = thisApi;
            // wait for OAuth window to be closed
            var timer = setInterval(function(){
                if(oAuthWindow.closed) {
                    clearInterval(timer);
                    yt.memberMetaApi.get(yt._memberId, "ytAccessToken").then(function(metaObj){
                        let token = metaObj.ytAccessToken;

                        // validate token
                        $.get(GOOGLE_TOKEN_INFO_URL, {   "access_token" : token})
                        .done(function(data){
                            if (data.aud == yt.oAuth_client_id) {
                                yt.getYoutTubeChannelFromAPI(token).then(function(channels){
                                    let channel = channels[0];
                                    let ytData = {
                                        "youtube_id" : channel.id,
                                        "youtube_name" : channel.snippet.title
                                    };
                                    yt.memberMetaApi.set(yt._memberId, ytData);
                                    resolve(ytData);
                                });
                            }
                        })
                        .fail(function(data, status, error){
                            console.log("YT Authorization Failed: " + status);
                            reject("YT Authorization Failed: " + status);
                        })
                    });
                }
            }, 500);
        }).bind(this);

    }

    getYoutTubeChannelFromAPI(token) {
        return new Promise(function(resolve, reject){
            let channels = [];
            $.ajax({
                url: YOUTUBE_DATA_API_URL + "/channels?_=" + new Date().getTime(),
                headers: { "Authorization" : "Bearer " + token},
                data: { "mine" : true, "part" : "snippet"}
            }).done(function(data){
                if (data.items != null) {
                    channels = data.items;
                }
                resolve(channels);
            }).fail(function(jqXhr, status, error){
                reject("API Call failed: " + status);
            });
        });
    }

    redirectToGoogleOAuth() {

        let oAuthUrl = GOOGLE_AUTH_URL + "?client_id=" + this.oAuth_client_id +
                    "&redirect_uri=" + this.redirect_url +
                    "&response_type=token" +
                    "&scope=" + YOUTUBE_READONLY_URL +
                    // TODO generate a state for more secure transactions
                    //"&state=some_string_to_validate_later"
                    "&login_hint=" + this._memberId;
        return window.open(oAuthUrl, "YouTube OAuth");
    }

}
