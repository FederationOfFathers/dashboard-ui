import {inject} from 'aurelia-framework';
import {StatsMagic} from 'team/stats/statsMagic';

@inject(StatsMagic)
export class RacerCache {

    constructor(statsMagic){
        this._statsMagic = statsMagic;

        this._raceStats = [];

        // this._racersByTrack['Track 1'] = [];
        // for(let i = 0; i < 30; i++){
        //     this._racersByTrack['Track 1'].push({
        //         name: `User ${i}`,
        //         time: 10 * i + i
        //     })
        // }
    }

    getRacerStats(){
        let racers = new Map();
        let result = [];
        this._raceStats = this._statsMagic.getStatByStatName('srl');
        for(let i = 0; i < this._raceStats.length; i++){
            let stat = this._raceStats[i];
            let racingStat = {
                    name: stat.UserID,
                    track: stat.Sub3,
                    time: stat.Value,
                    description: 'SRL: Best Completion Time'    
                }
            if(racers.has(stat.UserID)){
                racers.get(stat.UserID).push(racingStat);
            } else {
                racers.set(stat.UserID, [racingStat]);
            }
        }
        racers.forEach((v)=>{
            result.push(...v);
        });
        return result;//[... racers].map(r => r[1]);
    }

    getRacersByTrack(trackName){        
        return [];//this._racersByTrack[trackName] || [];
    }

    getTracks(){
        let result = new Set();
        for(let i = 0; i < this._raceStats.length; i++){
            result.add(this._raceStats[i].Sub3);
        }
        return Array.from(result);
    }

}