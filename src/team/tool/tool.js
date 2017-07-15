import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from 'api/api';

import environment from 'environment';

@inject(Router, Api)
export class TeamTool {
    constructor(router, api){
        this._router = router;
        this.teamToolLocation = api._baseUrl + "redirect/team-tool";
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
