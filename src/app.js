import {inject, computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
// import {AureliaUX} from 'aurelia-ux';

import {UserApi} from 'api/user';
import {UserCache} from 'cache/user';

import configureMainRoutes from 'routes/main';
import {AuthorizeStep} from 'routes/authorize';

// import {configureDesign} from './design';

@inject(UserApi, UserCache, AuthorizeStep, EventAggregator)
export class App {

  constructor(userApi, userCache, authorizeStep, ea) {

    this.userApi = userApi;
    this._userCache = userCache;
    this._authorizeStep = authorizeStep;
    this._ea = ea;

    this.navigating = false;

    this._userPing = window.setInterval(() => {
      this.getUserInfo();
    }, 60000); //Refresh user data every 60 seconds

    this._waitingMessages = [
      "Wait for it, I'm old...",
      "Working on it, don't get your panties in a wad...",
      "Hold your horses...",
      "I'm \"working\" on it..."
    ]

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

  attached() {
      this.routerProcessingSubscriber = this._ea.subscribe('router:navigation:processing', response => {
          this.navigating = true;
      });
      this.routerCompletedSubscriber = this._ea.subscribe('router:navigation:complete', response => {
          this.navigating = false;
      });
  }

  detached() {
      this.routerProcessingSubscriber.dispose();
      this.routerCompletedSubscriber.dispose();
  }


  configureRouter(config, router) {
    configureMainRoutes(config, router, this._userCache.get(), this._authorizeStep);
    this.router = router;
  }

  getUserInfo() {
    return this._userCache.update()    
  }
  @computedFrom('navigating')
  get waitingMessage(){
    return this._waitingMessages[Math.floor(Math.random() * this._waitingMessages.length)];
  }
  get user(){
    return this._userCache.get();
  }
}
