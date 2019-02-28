# Sali-Chat-server
![Build Status](https://travis-ci.org/bootstrap-tagsinput/bootstrap-tagsinput.svg?branch=master)
>沙粒聊天室的服务端2.1版本，请配合3.1版本客户端使用。
## 基于node.js设计的响应式程序
请参考其他客户端源代码以及开发者技术文档。<br>
沙粒聊天客户端开发者欢迎您的加入。[参考文档下载](http://45.76.194.96:8085/helpdoc.pdf)
+ [React App](https://github.com/Neboer/sali-chat-app)<br>
(由本人开发，采用Ant design界面，易于维护，欢迎各位开发者加入)
+ [Android App](https://github.com/Eibon00/sali-chat-android/)<br>
(这个开发者经常吔桶，过于咕咕，如果仓库是空的还望见谅)
## 通信用WebSocket+http
响应式消息传输，异步axios处理，有效提高加载速度，响应消息更加快速便捷。
## 推荐使用docker进行项目部署
项目源码包含dockerfile，可以直接构建并运行。
## 接入数据库
将用户表和聊天记录表保存在数据库中，便于管理，查询。
### 项目部署流程
 1. 克隆整个仓库，然后进入仓库中
    ```
    git clone https://github.com/Neboer/sali-chat-server.git
    cd sali-chat-server
    ```
 2. 修改数据库配置
    ```
    vim Database.json
    ```
    注意，请妥善配置数据库。若数据库存在，首次运行会与之对接。如果出现差错，请issue告知。<br>
    程序运行之后会主动检查是否连通，若没有连接成功会直接报错终止。
 2. 直接建立镜像（将name换成你的名字）
    ```
    docker build -t name .
    ```
 3. 选定端口号。在后台运行实例（将name换成你的名字）
    ``` 
    docker run -d -it -p 8080:8080 -p 8081:8081 -p 3306 name
    ```
 如果没有错误，那么输入```docker ps``` 就可以查看运行状态了。<br>
 这个项目是服务端程序，需要和客户端配合。