export default function configureMainRoutes(config, router, user, AuthorizeStep) {
    let admin = user && user.admin ? true : false;
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
        {route: '', redirect: 'channels'}, 
        {
            route: ['team', 'team/*details'],
            name: 'team',
            moduleId: 'team/team',
            nav: false,
            title: 'Team',
            settings: {
                roles: ["user"],
                icon: 'resources/images/svg/Channel' 
            }
        }, 
        {
            route: 'apiTest',
            name: 'apiTest',
            moduleId: 'apiTests/apiTests',
            nav: false,
            title: 'API Tests',
            settings: {
                roles: ["user"],
                icon: 'resources/images/svg/Channel'
            }
        }, 
        {
            route: ['admin'],
            name: 'admin',
            moduleId: 'admin/admin',
            nav: admin,
            title: "Admin",
            settings: {
                roles: ["user", "admin"],
                icon: 'resources/images/svg/Admin'
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
            moduleId: 'channels/channels',
            nav: true,
            title: 'Channels',
            settings: {
                    roles: ["user", "admin"],
                    icon: 'resources/images/svg/Channel'
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

