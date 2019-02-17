// ServerCommand用来构筑服务器传递到客户端的命令对象,需要客户端实现execute方法
import Command from "./Command";
import User from "./User";

interface Iparameters {
    user:User
}

class ServerCommand extends Command{ // 注意：服务器端的ServerCommand对象没有执行意义，因此不会执行。
    public static commandList = ['login','logout'];
    public static parse = (str:string):ServerCommand => {
        str = str.slice(2,str.length);// 删除前缀sc
        const a = JSON.parse(str);
        const b:User = User.parse(a.parameters.user);
        return new ServerCommand(a.command,{user:b})
    };
    public parameters:Iparameters;
    public toString = () => {
        const a = this.parameters.user.toString();
        return ('sc' + JSON.stringify( // sc 在这里是指ServerCommand，为了便于客户端识别，我们用前缀标识符(Prefix identifier)来区别各种字符串
            {
                command:this.command,
                parameters:{user:a}
            })
        )
    };
    public send = (socket:WebSocket) => {
        socket.send(this.toString())
    }
}

export default ServerCommand