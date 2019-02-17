// 和massage一起，作为服务器与客户端沟通的命令对象
import Transmission from "./Transmission";
// import User from "./User";

class Command extends Transmission{
    public static parse = (commandString:string) => {
        const a = JSON.parse(commandString);
        return new Command(a.command,a.parameters)
    };

    public command:string;
    public parameters:{};
    public execute:(...args: any) => any; // 命令可以被执行，要求类体继承之后自行实现
    constructor(command:string,parameters:{}){
        super();
        this.command = command;
        this.parameters = parameters;
    }
    public toString = ():string => {
        return JSON.stringify(
            {
                command:this.command,
                parameters:this.parameters
            }
        )
    };
    public send = (socket:WebSocket) => {
        socket.send(this.toString())
    }
}

export default Command