

export default function configureMainRoutes(config, router, user, AuthorizeStep){
    let admin = user && user.admin ? true : false;
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([

      { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome', settings: { roles: [ "user" ] } },
      { route: 'apiTest', name: 'apiTest', moduleId: 'apiTests/apiTests', nav: true, title: 'API Tests', settings: { roles: [ "user" ] } },
      { route: 'admin', name: 'admin', moduleId: 'admin/admin', nav: admin, title: "Admin", settings: { roles: [ "user", "admin" ] } },
      { route: 'login', name: 'login', moduleId: 'login', nav: false, title: "Please Log In", settings: { roles: [ "anonymous" ] } },
    ]);
}

