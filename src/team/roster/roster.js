import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class RosterList {
    constructor(router){
        this._router = router;
    }
    activate(){
        // do something
    }
}