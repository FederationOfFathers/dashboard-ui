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
    this.userCache = userCache;
    this.user;
    this._authorizeStep = authorizeStep;

    this._userPing = window.setInterval(() => {
      this.getUserInfo();
    }, 60000); //Refresh user data every 60 seconds
  }

  activate() {
    return this.getUserInfo()
      .then(() => {
        this.user = this.userCache.get();
      });
  }


  configureRouter(config, router) {
    configureMainRoutes(config, router, this.userCache.get(), this._authorizeStep);
    this.router = router;
  }

  getUserInfo() {
    return this.userApi.ping().then(data => {
      this.userCache.set(data);
    }).catch(err => {
      console.error(err)
    });
  }
}
