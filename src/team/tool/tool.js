import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class TeamTool {
    constructor(router){
        this._router = router;
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