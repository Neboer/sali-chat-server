// 服务器入口，程序主逻辑
import http = require('http');
import {Server} from 'ws';
import {insertUser, queryUser, queryUserExistence} from "./module/Database";
import Message from './module/Message'
import {parse, postSender, userList} from "./module/Post"
import ServerCommand from './module/ServerCommand'
import ServerUser from './module/ServerUser'
import User from "./module/User";

http.createServer((request, response) => {
    if (request.method === 'POST') {// verify form data
        let data = '';
        request.on('data', (chunk => {
            data += chunk
        }));
        request.on('end', () => {
            const a = JSON.parse(data);
            response.writeHead(200, {
                'Access-Control-Allow-origin': '*'
            });
            switch (request.url) {
                case "/login":
                    queryUser(a.username, a.password,
                        () => postSender(response, 'no user'),
                        () => postSender(response, 'wrong password'),
                        () => postSender(response, 'ok')
                    );
                    break;
                case "/register":
                    queryUserExistence(a.username,
                        () => {
                            insertUser(a.username, a.password,
                                () => postSender(response, 'ok')
                            );
                        },
                        () => postSender(response, 'no')
                    );
                    break;
                case "/attempt":
                    queryUserExistence(a.username,
                        () => postSender(response, 'ok'),// 用户名不存在，返回ok准许注册
                        () => postSender(response, 'no')// 用户名存在，返回no禁止注册
                    );
                    break;
            }
        });
    }
    if (request.method === 'GET') {
        response.writeHead(200, {'Access-Control-Allow-origin': '*'});
        postSender(response, userList.toOnlineString())
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
            const logoutUser: ServerUser | null = userList.findUserBySocket(socket);
            if (logoutUser !== null) {
                logoutUser.logout();
                userList.broadcast(new ServerCommand('logout', {user: logoutUser.toUser()}))
            } else {
                console.error("warning,unauthorized logout")
            }
        }
    )
});

