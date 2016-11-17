import {inject, computedFrom} from 'aurelia-framework';

export class Team{

    constructor(){

    }
    
    configureRouter(config, router){
        this.router = router;
        config.title = 'Team';
        config.map([
            {
                route: [''],
                name: 'empty',
                moduleId: 'empty',
                nav: false,
                title: 'Team',
                settings: {
                    roles: ["user"]
                }
            },
            {
                route: ['stats', 'stats/*details'],
                name: 'stats',
                moduleId: 'team/stats/stats',
                nav: true,
                title: 'Stats',
                settings: {
                    roles: ["user"]
                }
            }
        ]);
    }

    get atHome(){
        return this.router && this.router.currentInstruction && this.router.currentInstruction.config.name == "empty";
    }



}