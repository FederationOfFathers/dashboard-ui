import {inject} from 'aurelia-framework';
// import {AureliaUX} from 'aurelia-ux';

import {UserApi} from 'api/user';
import {UserCache} from 'cache/user';

import configureMainRoutes from 'routes/main';
import {AuthorizeStep} from 'routes/authorize';

// import {configureDesign} from './design';

@inject(UserApi, UserCache, AuthorizeStep)
export class App {

  constructor(userApi, userCache, authorizeStep) {

    this.userApi = userApi;
    this._userCache = userCache;
    this._authorizeStep = authorizeStep;

    this._userPing = window.setInterval(() => {
      this.getUserInfo();
    }, 60000); //Refresh user data every 60 seconds
  }

  activate() {
    
    return this.getUserInfo()
      .catch(err => {
                let response = err.message.split(":")[1].trim();
                if(response == "401"){
                    window.location.href="#login";//this.router.navigate('#/login')
                }
            });
  }


  configureRouter(config, router) {
    configureMainRoutes(config, router, this._userCache.get(), this._authorizeStep);
    this.router = router;
  }

  getUserInfo() {
    return this._userCache.update()    
  }

  get user(){
    return this._userCache.get();
  }
}
