import {inject} from 'aurelia-framework';

import {UserApi} from 'api/user';
import {UserCache} from 'cache/user';

import {Redirect} from 'aurelia-router';

@inject(UserApi, UserCache)
export class App {

  constructor(userApi, userCache){
    this.userApi = userApi;
    this.userCache = userCache;
    this.user;

    this._userPing = window.setInterval(()=>{
      this.getUserInfo();
    }, 60000); //Refresh user data every 60 seconds
  }

  activate(){
    return this.getUserInfo()
      .then(()=>{
          this.user = this.userCache.get();
      });
  }

  configureRouter(config, router) {
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([

      { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome', settings: { roles: [ "user" ] } },
      { route: 'apiTest', name: 'apiTest', moduleId: 'apiTests/apiTests', nav: true, title: 'API Tests', settings: { roles: [ "user" ] } },
      { route: 'admin', name: 'admin', moduleId: 'admin/admin', nav: false, title: "Admin", settings: { roles: [ "user", "admin" ] } },
      { route: 'login', name: 'login', moduleId: 'login', nav: false, title: "Please Log In", settings: { roles: [ "anonymous" ] } },
    ]);

    this.router = router;
  }

  getUserInfo(){
    return this.userApi.ping().then(data => {
            this.userCache.set(data);
        }).catch(err => {
            console.error(err)
        });
  }
}

@inject(UserCache)
class AuthorizeStep {
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
