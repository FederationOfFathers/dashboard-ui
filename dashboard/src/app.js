export class App {
   configureRouter(config, router) {
    config.title = 'FoF Dashboard';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'apiTest',         name: 'apiTest',        moduleId: 'apiTests/apiTests',        nav: true, title: 'API Tests' }
    ]);

    this.router = router;
  }
}
