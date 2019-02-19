// 服务器入口，程序主逻辑
import http = require('http');
import {Server} from 'ws'
// import ClientCommand from './module/ClientCommand'
import Message from './module/Message'
import {parse, postSender, userList} from "./module/Post"
import ServerCommand from './module/ServerCommand'
import ServerUser from './module/ServerUser'
import User from "./module/User";

const httpServer = http.createServer((request, response) => {
    if (request.method === 'POST') {// verify form data
        let data = '';
        request.on('data', (chunk => {
            data += chunk
        }));
        request.on('end', () => {
            response.writeHead(200, {
                'Access-Control-Allow-origin': '*'
            });
            switch (request.url) {
                case "/login":
                    postSender(response, 'ok');
                    break;
                case "/register":
                    postSender(response, 'ok');
                    break;
                case "/attempt":
                    postSender(response, 'ok');
                    break;
            }
        });
    }
    if (request.method === 'GET'){
        response.writeHead(200,{'Access-Control-Allow-origin': '*'});
        postSender(response,userList.toOnlineString())
    }
    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Access-Control-Allow-origin': '*', 'Access-Control-Allow-Methods': 'POST'
        });
        response.end()
    }
}).listen(8080);

const wsServer = new Server({
    port: 8081,
    noServer: true
});

wsServer.on('connection', (socket, req) => {// 服务器与客户端之间传递的数据有命令和消息两种。命令和消息都是JSON串。
    const name = parse(req.url);// 解析连接url，获得用户名
    const existUser: ServerUser | null = userList.findUserByName(name);
    if (existUser === null) { // 新用户首次登录
        const loginUser: ServerUser = (new ServerUser(new User(name, new Date(), new Date(0))));
        loginUser.login(socket);
        userList.addUser(loginUser);
        userList.broadcast(new ServerCommand('login', {user: loginUser.toUser()}))// 广播用户上线消息
    } else {
        (existUser as ServerUser).login(socket);
        userList.broadcast(new ServerCommand('login', {user: (existUser as ServerUser).toUser()}))
    }
    socket.on('message', data => {           // 命令是"{command:addUser,...}"的形式，第一个key一定是command
        const comeMessage = Message.parse(data.toString());// 服务器解析Message为消息对象
        userList.broadcast(comeMessage)
    });
    socket.on("close", () => {
            const logoutUser:ServerUser|null = userList.findUserBySocket(socket);
            if(logoutUser!==null){
                logoutUser.logout();
                userList.broadcast(new ServerCommand('logout',{user:logoutUser.toUser()}))
            } else {
                console.error("warning,unauthorized logout")
            }
        }
    )
});

