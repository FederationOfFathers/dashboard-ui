import {inject} from 'aurelia-framework';

import {UsersApi} from 'api/users';

@inject(UsersApi)
export class UsersCache{
    constructor(usersApi){
        this._usersApi = usersApi;

        this._users = new Map();
    }

    initialize(){
        return this._usersApi.getAll()
            .then(users => {
                return this.users = users;
            })
    }

    set users(users){
        for(let userID in users){
            let user = users[userID];
            this._users.set(userID, {
                Seen: user.Seen,
                GamerTag: user.User.GamerTag,
                Id: user.User.ID,
                Name: user.User.Name
            })
        }
    }
    get users(){
        return this._users;
    }

}