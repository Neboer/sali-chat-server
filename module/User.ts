// User对象可以化为字符串进行传递，也可以被ServerUser解析为ServerUser对象，是服务器与客户端之间传递“用户”的唯一形式
import Users from "./Users";

class User extends Users{
    public static parse = (userString:string):User => {
        const a = JSON.parse(userString);
        return new User(a.username,new Date(a.lastLogin),new Date(a.lastLogout))
    };
    // public username:string;
    // public lastLogin:Date;
    // public lastLogout:Date;
    constructor(username: string, lastLogin: Date, lastLogout: Date) {
        super();
        this.username = username;
        this.lastLogin = lastLogin;
        this.lastLogout = lastLogout;
    }
    public toString = ():string => {
        const a = {
            username:this.username,
            lastLogin:this.lastLogin.toString(),
            lastLogout:this.lastLogout.toString()
        };
        return JSON.stringify(a)
    }
}

export default User