import {inject} from 'aurelia-framework';
import {RacerCache} from 'team/stats/racing/racerCache';

@inject(RacerCache)
export class RacingStats {

    constructor(racerCache){
        this._racerCache = racerCache;

        this.tracks = [];

        for(let i = 0; i < 5; i++){
            this.tracks.push({
                name: `Track ${i}`
            })
        }

    }

    activate() {
        this.selectedTrack = this.tracks[0];
    }

    get racers(){
        return this._racerCache.getRacersByTrack(this.selectedTrack);
    }

}