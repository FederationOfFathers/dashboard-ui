import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {UserCache} from 'cache/user';

@inject(UserCache, Router)
export class Members {

	constructor(userCache, router){
	      this._userCache = userCache;
              this._router = router;
	}

	activate() {
                return this._router.navigateToRoute('member', {name: this._userCache.user.name})
	}
}
