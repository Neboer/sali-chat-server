// 消息类定义，所有传递中的消息都是消息类的实例。
import Transmission from "./Transmission";

class Message extends Transmission{
    public static parse = (messageJsonString: string): Message|null => {
        const a = JSON.parse(messageJsonString);
        if(a.poster === undefined){
            return null
        }
        else {
            return new Message(a.poster, new Date(a.time), a.message)
        }
    };
    public poster: string; // 发送者
    public time: Date; // 发送时间
    public message: string; // 消息内容
    constructor(poster: string, time: Date, message: string) {
        super();
        this.poster = poster;
        this.time = time;
        this.message = message;
    }

    public send = (socket: WebSocket): void => {
        socket.send(this.toString())
    };

    public toString = () => {
        return JSON.stringify(
            {poster: this.poster, time: this.time.toString(), message: this.message})
    };
}
export default Message