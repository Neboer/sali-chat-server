// 工具集合，多种实用函数，降低主服务器运行代码复杂度，便于识别逻辑
import * as http from "http";
// import ClientCommand from "./ClientCommand";
import Message from './Message'
import ServerCommand from "./ServerCommand";
import ServerUser from "./ServerUser";

export function postSender(response: http.ServerResponse, message: string): void {
    response.write(message, 'utf-8');
    response.end();
}

export const userList = {
    userList: [] as ServerUser[],
    addUser: addUser,
    broadcast: broadcast,
    findUserByName: findUserByName,
    findUserBySocket: findUserBySocket,
    toOnlineString: toOnlineString
};

function addUser(user: ServerUser) {
    this.userList.push(user)
}

function broadcast(content: Message | ServerCommand) {
    this.userList.forEach(user => {
        try{
            user.send(content)
        }
        catch (e) {
            console.warn(e)
        }
    })
}

function findUserByName(username: string): ServerUser | null {
    const a = this.userList.filter(user => {
        if (user.username === username) {
            return user
        }
    });
    if (a.length === 0) {
        return null
    } else {
        return a[0]
    }
}

function findUserBySocket(socket: WebSocket | any): ServerUser | null {
    const a = this.userList.filter((user) => {
        if (user.socket === socket) {
            return user
        }
    });
    if (a.length === 0) {
        return null
    } else {
        return a[0]
    }
}

function toOnlineString() {
    return JSON.stringify(this.userList
        .filter((user: ServerUser) => {
            return (user.socket.readyState === 1)
        })
        .map((user: ServerUser) => {
            return user.toUser().toString()
        }))
}

export function parse(usernameString: string) {
    return decodeURI(usernameString.slice(1, usernameString.length))
}
