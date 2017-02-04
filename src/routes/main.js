export default function configureMainRoutes(config, router, user, AuthorizeStep) {
    let admin = user && user.admin ? true : false;
    config.title = 'FoF Dashboard';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
        {route: '', redirect: 'team-tool'}, 
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
        { //This is temporary until Team Tool gets integrated with Dashboard
            route: ['team-tool'],
            // redirect: 'http://team.fofgaming.com',
            name: 'team-tool',
            moduleId: 'team/tool/tool',
            nav: true,
            title: 'Team Tool',
            settings: {
                roles: ["user"],
                icon: 'resources/images/svg/FoF', 
            }
        },
        { //This is temporary until the roster list gets integrated with Dashboard
            route: ['roster-list'],
            name: 'roster-list',
            moduleId: 'team/roster/roster',
            nav: true,
            title: 'Roster List',
            settings: {
                roles: ["user"],
                icon: 'resources/images/svg/Roster',
            }
        }, 
        { //This will temporarily be a main navigation. Later to be nested inside team
            route: ['racing-stats', 'racing-stats/*details'],
            name: 'racing-stats',
            moduleId: 'team/stats/racing/racing',
            nav: false,
            title: 'SRL (Beta)',
            settings: {
                roles: ["user"],
                icon: 'resources/images/svg/SRL'  
            }
        }, 
        {
            route: 'apiTest',
            name: 'apiTest',
            moduleId: 'apiTests/apiTests',
            nav: false,
            title: 'API Tests',
            settings: {
                roles: ["user", "admin"],
                icon: 'resources/images/svg/Channel'
            }
        }, 
        {
            route: ['admin'],
            name: 'admin',
            moduleId: 'admin/admin',
            nav: false,
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
                    roles: ["user"],
                    icon: 'resources/images/svg/Channels'
            }
        },
        {
            route: 'members/:name?',
            name: 'members',
            //moduleId: 'members/redirect/me',
            moduleId: 'members/single/member',
            title: 'Members',
            nav: true,
            href: "#members/",
            settings: {
                    roles: ["user"],
                    icon: 'resources/images/svg/Channels'
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

