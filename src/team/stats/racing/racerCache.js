
export class RacerCache {

    constructor(){
        this._racersByTrack = {

        };

        this._racersByTrack['Track 1'] = [];
        for(let i = 0; i < 30; i++){
            this._racersByTrack['Track 1'].push({
                name: `User ${i}`,
                time: 10.32 * i + i
            })
        }
    }

    getRacersByTrack(trackName){        
        return this._racersByTrack[trackName] || [];
    }

}