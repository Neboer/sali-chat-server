// 用于构筑用户端传递到服务端的命令，目前功能还没有实现
import Command from "./Command";
// import ServerUser from "./ServerUser";
import User from "./User";

class ClientCommand extends Command{
    public static parse = (str:string):ClientCommand => {
        const a = JSON.parse(str);
        const b:User = User.parse(a.parameters.user);
        return new ClientCommand(a.command,{user:b})
    };
    public parameters = {
        user:new User('',new Date(),new Date())
    };
    public toString = () => {
        const a = this.parameters.user.toString();
        return JSON.stringify(
            {
                command:this.command,
                parameters:{user:a}
            }
        )
    };
}

export default ClientCommand