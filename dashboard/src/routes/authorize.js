import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {UserCache} from 'cache/user';

@inject(UserCache)
export class AuthorizeStep {
    constructor(userCache) {
            this.userCache = userCache;
            this.user = this.userCache.get();
    }
    get admin(){
      return this.user ? this.user.admin : false;
    }

    run(navigationInstruction, next) {
      if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'admin' ) !== -1 ) ) {
              if ( !this.admin ) {
                      return next.cancel( new Redirect( 'welcome' ) );
              }
      } else if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'user' ) !== -1 ) ) {
              if ( !this.user ) {
                      return next.cancel( new Redirect( 'login' ) );
              }
      } else if ( navigationInstruction.getAllInstructions().some( i => i.config.settings.roles.indexOf( 'anonymous' ) !== -1 ) ) {
              if ( this.user ) {
                      return next.cancel( new Redirect( 'welcome' ) );
              }
      }
      return next();
    }
}
