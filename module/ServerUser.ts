// 用于抽象连接到服务器的用户
import Message from './Message'
import ServerCommand from './ServerCommand'
import User from './User'
import Users from "./Users";

class ServerUser extends Users{
    public socket: WebSocket;

    constructor(user:User) {
        super(); // ServerUser对象只能由User实例化
        this.username = user.username;
        this.lastLogin = user.lastLogin;
        this.lastLogout = user.lastLogout
    }

    public login = (socket:any|WebSocket) => {
        this.socket = socket;
        this.lastLogin = new Date();
    };
    public logout = () => {
        this.lastLogout = new Date();
    };

    public send(message: Message|ServerCommand) {
        if (this.socket.readyState===1) {
            message.send(this.socket)
        }
    }
    public toUser = () => {// 转化为User对象
        return new User(this.username,this.lastLogin,this.lastLogout)
    };
}


export default ServerUser