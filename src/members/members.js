import {inject} from 'aurelia-framework';

import {UserCache} from 'cache/user';

@inject(UserCache)
export class Members {

    constructor(userCache){
            this._userCache = userCache;
    }

    activate(){
    }
}
