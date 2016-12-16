import {inject, computedFrom} from 'aurelia-framework';
import {RacerCache} from 'team/stats/racing/racerCache';
import {StatsMagic} from 'team/stats/statsMagic';

@inject(RacerCache, StatsMagic)
export class RacingStats {

    constructor(racerCache, statsMagic){
        this._racerCache = racerCache;
        this._statsMagic = statsMagic;


        this.tracks = [];   
        this.trackStats = new Map(); 
        this._racers = [];   

        this.query = "";

    }

    activate() {
        this.selectedTrack = this.tracks[0];
        return this._statsMagic.initialize()
            .then(()=> {
                this._racers = this._racerCache.getRacerStats()
                    .sort((a, b) => parseInt(a.time) < parseInt(b.time) ? -1 : 1);

                this.tracks = this._racerCache.getTracks()
                    .sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);

                this._racers.forEach(racerStat => {
                    let track = racerStat.track;
                    if(this.trackStats.has(track)){
                        let trackStat = this.trackStats.get(track);
                        racerStat.position = trackStat.length + 1;
                        trackStat.push(racerStat);
                    } else {
                        racerStat.position = 1;
                        this.trackStats.set(track, [racerStat]);
                    }
                });



            });
    
    }

    @computedFrom('selectedTrack', 'query')
    get racers(){
        let racers = this.trackStats.get(this.selectedTrack) || [];
        return racers.filter(r => r.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1);
        // return this._racers
        //     .filter(r => {
        //         return r.track === this.selectedTrack && r.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1
        //     })
            
    }

}