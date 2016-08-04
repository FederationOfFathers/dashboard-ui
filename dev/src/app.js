export class App {
  configureRouter(config, router) {
    config.title = 'FoF Dashboard';
    config.map([
      { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' }
    ]);
    this.router = router;
  }
}
