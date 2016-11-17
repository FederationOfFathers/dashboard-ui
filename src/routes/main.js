export default function configureMainRoutes(config, router, user, AuthorizeStep) {
    let admin = user && user.admin ? true : false;
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
        {route: '', redirect: 'team'},
        {
            route: ['team', 'team/*details'],
            name: 'team',
            moduleId: 'team/team',
            nav: true,
            title: 'Team',
            settings: {
                roles: ["user"]
            }
        }, 
        {
            route: 'apiTest',
            name: 'apiTest',
            moduleId: 'apiTests/apiTests',
            nav: true,
            title: 'API Tests',
            settings: {
                roles: ["user"]
            }
        }, 
        {
            route: ['admin'],
            name: 'admin',
            moduleId: 'admin/admin',
            nav: admin,
            title: "Admin",
            settings: {
                roles: ["user", "admin"]
            }
        }, 
        // {
        //     route: 'admin/dics',
        //     name: 'dics',
        //     moduleId: 'admin/dics',
        //     nav: admin,
        //     title: "DiCS",
        //     settings: {
        //         roles: ["user", "admin"]
        //     }
        // }, 
        {
                route: ['channels', 'channels/*details'],
                name: 'channels',
                moduleId: 'channels/my-channels/my-channels',
                nav: true,
                title: 'Channels',
                settings: {
                        roles: ["user", "admin"]
                }
        }, 
        {
            route: 'login',
            name: 'login',
            moduleId: 'login',
            nav: false,
            title: "Please Log In",
            settings: {
                roles: ["anonymous"]
            }
        }
    ]);
}

