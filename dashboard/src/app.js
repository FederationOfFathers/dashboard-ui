import {inject} from 'aurelia-framework';
import {UserApi} from 'api/user';
import {UserCache} from 'cache/user';

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
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'apiTest',         name: 'apiTest',        moduleId: 'apiTests/apiTests',        nav: true, title: 'API Tests' },
      { route: 'admin',         name: 'admin',        moduleId: 'admin/admin',        nav: this.user.admin , title: 'Admin Portal' }
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
