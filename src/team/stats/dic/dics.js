import {
    inject
} from 'aurelia-framework';
import {
    HttpClient
} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Dics {
    constructor(HttpClient) {
        this.http = HttpClient
        this.stat = {
            129990: "kills",
            129991: "assists",
            129992: "wins",
            129993: "matches",
            129994: "seconds_played",
            129995: "precision_kills",
            129996: "grenade_kills",
            129997: "deaths",
            129998: "score"
        }
    }
    activate() {
        var userget = this.http.fetch("http://fofgaming.com:8875/v2/users.json")
            .then(response => response.json())
        var statget = this.http.fetch("http://fofgaming.com:8874/v1/s/129990,129991,129992,129993,129994,129995,129996,129997,129998.json")
            .then(response => response.json())
        return Promise.all([userget, statget]).then(([u, s]) => {
            this.users = new Map()
            for (var k in u) {
                var user = u[k]
                if (user.XBL == "" || user.SeenTimestamp == 0) {
                    continue;
                }
                if (typeof s[k] == "undefined") {
                    continue;
                }
                for (var n in this.stat) {
                    if (typeof s[k][n] == "undefined") {
                        user[this.stat[n]] = 0
                    } else {
                        user[this.stat[n]] = s[k][n]
                    }
                }
                this.users.set(k, user)
            }
        })
    }
}
