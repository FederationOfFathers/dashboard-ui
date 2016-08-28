import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {Api} from 'api/api';

export class App {
   configureRouter(config, router) {
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome', settings: { roles: [ "user" ] } },
      { route: 'apiTest', name: 'apiTest', moduleId: 'apiTests/apiTests', nav: true, title: 'API Tests', settings: { roles: [ "user" ] } },
      { route: 'admin', name: 'admin', moduleId: 'admin/index', nav: false, title: "Admin", settings: { roles: [ "user", "admin" ] } },
      { route: 'login', name: 'login', moduleId: 'login', nav: false, title: "Please Log In", settings: { roles: [ "anonymous" ] } }
    ]);

    this.router = router;
  }
}

@inject(Api)
class AuthorizeStep {
        constructor(api) {
                this.api = api
        }
        auth() {
                if ( typeof this.authPromise == "undefined") {
                        this.authPromise = this.api.get("ping")
                }
                return this.authPromise.then(data => {
                       console.log("b")
                       this.admin = data.admin
                       this.user = true
                       this.data = data
                }).catch(err => {
                       this.admin = false
                       this.user = false
                });
        }
        run(navigationInstruction, next) {
            return this.auth().then(function() {
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
            }.bind(this));
        }
}
