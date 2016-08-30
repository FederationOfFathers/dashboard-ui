export class UserCache{
    constructor(){
        this.user;
    }

    set(userInfo){
        this.user = userInfo;
    }
    get(){
        return this.user;
    }
}