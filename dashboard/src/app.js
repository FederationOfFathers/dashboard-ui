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
                this.admin = false
                this.user = false
                // TODO How can we force the app to wait here? That seems pretty important. 
                api.get("ping").then(data => {
                        this.admin = data.admin;
                        this.user = true;
                }).catch(err => {
                        // Logged out or app down
                });
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
