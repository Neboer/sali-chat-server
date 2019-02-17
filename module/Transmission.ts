// 用于规范所有服务器与客户端之间的传输信息对象
abstract class Transmission {
    public parse = (str:string):Transmission => this;
    public toString = (thing:Transmission):string => String();
}

export default Transmission