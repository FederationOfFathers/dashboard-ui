import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import environment from 'environment';

@inject(Router)
export class TeamTool {
    constructor(router){
        this._router = router;
        if(environment.debug){
            this.teamToolLocation = "//dev.dashboard.fofgaming.com/api/v0/redirect/team-tool";
        } else {
            this.teamToolLocation = "/api/v0/redirect/team-tool";
        }
    }
    activate(){
        //Sneaky way of finding out if we are navigating back to this same location
        // if(window.location.href.indexOf('navigated') > -1){
        //     this._router.navigate('channels');
        // } else {
        //     window.location.href += "/navigated";
        //     window.location = "http://team.fofgaming.com";
        // }
    }
}
