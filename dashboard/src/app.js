export class App {
   configureRouter(config, router) {
    config.title = 'FoF Dashboard';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'apiTest',         name: 'apiTest',        moduleId: 'apiTest',        nav: true, title: 'API Tests' }
    ]);

    this.router = router;
  }
}
