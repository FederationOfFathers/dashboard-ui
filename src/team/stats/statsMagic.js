import {inject} from 'aurelia-framework';
import {StatsApi} from 'api/stats';

import {UsersCache} from 'cache/users';

const STAT_NAMES = { //TODO: move this to some external file
    'srl' : [130006,130007,130008,130009]
}

@inject(StatsApi, UsersCache)
export class StatsMagic {
    constructor(statsApi, usersCache){
        this._statsApi = statsApi;
        this._usersCache = usersCache;
        this.categories = new Map();
        this.destinyStatCategories = [];
        this.destinyStats;
    }

    initialize(){
        this.categories = new Map();
        return this._usersCache.initialize()
            .then(() => {
                return this._statsApi.getCategories()
                    .then(c => {
                        for(let category of c){
                            this.categories.set(category.ID, category);
                        }
                        this.destinyStatCategories = this.getStatSummaryByProduct('destiny');
                        return this.getAllDestinyStats();
                    });
            });
    }

    getStatSummaryByProduct(product){
        let result = [];
        this.categories.forEach((value, key) => {
            if(value.Product == product){
                result.push(value);
            }
        });
    
        return result;
    }

    getAllDestinyStats(){
        //TODO: Optimize the data object to make a smaller footprint
        let statsToGet = [];
        this.destinyStatCategories.forEach((value, key)=>{
            statsToGet.push(value.ID);
        });
        return this._statsApi.getById(statsToGet.join(','))
            .then(stats =>{
                this.transformStats(stats);
                this.destinyStats = stats;
                console.log(stats);
                return this.destinyStats;
            })
    }
    getStatByStatName(name){
        //TODO: Need Stat Name lookup for id
        let result = [];
        for(let userID in this.destinyStats){
            let userStat = this.destinyStats[userID];
            switch(name) {
                case 'srl':
                    let srlStatIDs = STAT_NAMES.srl;
                    for(let i = 0; i < srlStatIDs.length; i++){
                        let stat = userStat.stats[srlStatIDs[i]];
                        if(stat){
                            result.push(Object.assign({UserID: userID, User: this._usersCache.users.get(userID)}, stat));
                        }
                    }
                    break;
                default: 
                    break;
            }
        }
        return result;
    }
    getStatById(id){

    }

    transformStats(stats){
        for(let userID in stats){
            let userStat = stats[userID];            
            for(let stat in userStat){
                let statValue = userStat[stat];
                let prettyStatName = Object.assign({Value: statValue}, this.categories.get(parseInt(stat)));
                userStat[stat] = prettyStatName;
            }
            stats[userID] = {
                user: this._usersCache.users.get(userID),
                stats: userStat
            };
        }
    }
}