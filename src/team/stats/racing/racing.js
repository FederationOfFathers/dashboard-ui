import {inject, computedFrom} from 'aurelia-framework';
import {RacerCache} from 'team/stats/racing/racerCache';
import {StatsMagic} from 'team/stats/statsMagic';

@inject(RacerCache, StatsMagic)
export class RacingStats {

    constructor(racerCache, statsMagic){
        this._racerCache = racerCache;
        this._statsMagic = statsMagic;


        this.tracks = [];   
        this._racers = [];    

    }

    activate() {
        this.selectedTrack = this.tracks[0];
        return this._statsMagic.initialize()
            .then(()=> {
                this._racers = this._racerCache.getRacerStats();
                this.tracks = this._racerCache.getTracks().sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
            });
    
    }

    @computedFrom('selectedTrack')
    get racers(){
        return this._racers
            .filter(r => r.track === this.selectedTrack)
            .sort((a, b) => parseInt(a.time) < parseInt(b.time) ? -1 : 1);
    }

}