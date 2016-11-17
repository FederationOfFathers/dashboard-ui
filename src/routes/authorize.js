import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {UserCache} from 'cache/user';

@inject(UserCache)
export class AuthorizeStep {
    constructor(userCache) {
            this.userCache = userCache;
    }
    get admin(){
        let user = this.userCache.get();
      return user ? user.admin : false;
    }

    run(navigationInstruction, next) {
        let user = this.userCache.get();
      if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'admin' ) !== -1 ) ) {
              if ( !this.admin ) {
                      return next.cancel( new Redirect( 'team' ) );
              }
      } else if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'user' ) !== -1 ) ) {
              if ( !user ) {
                      return next.cancel( new Redirect( 'login' ) );
              }
      } else if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'anonymous' ) !== -1 ) ) {
              if ( user ) {
                      return next.cancel( new Redirect( 'team' ) );
              }
      }
      return next();
    }
}
