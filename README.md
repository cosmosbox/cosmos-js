# cosmos

实验中....
[experimental now]
a node js distributed game server framework


实验性的游戏服务器框架，

## 架构

### 以etcd为中心(master)
![cosmos架构图](./docs/architecture.jpg)

我是一个actor，向etcd注册我自己，然后etcd就告诉我的同伴——其它actor了

然后，我就可以跟他们rpc了！我就是我！

有一天，一个新的actor又加入了，

etcd会主动告诉我，然后我又可以跟这个新成员rpc了

看起来etcd很重要嘛！它（master）死了怎么办？

不要紧, etcd是分布式高可用的！etcd1死了，etcd2补上

### 类比, 学生与学校
![我的学生之旅](./docs/school.jpg)

## cosmos模块化

* cosmos : 本质上一个工程管理器，读取配置，启动actor
	* cosmos-actor : 核心，一个自动发现的RPC框架，可脱离cosmos单独使用，向etcd注册，向同伴rpc
	* cosmos-logger : 打印日志，无他


## 希望使用....

* 尽可能的少写代码：不要忙死在折腾的事情上
* 尽可能的使用稳定的第三方库：不重复造轮子
* 尽可能的精简架构：越精简的架构越不易出问题

## 去实现....

* 超级简单的使用
* 分布式：多台机器可不是
* master高可用
* 任意逻辑服务器被kill自动重启
* 无状态：进程被kill的影响降到最低
* 可协程, 可Promise

## Node Js开发组件

* babel(已弃用): 使用最新的ECMAScript 6进行开发，纯面向对象，要配合Gulp
* bluebird/promise: NodeJS回调优化

## 关键的第三方组件/库:

* etcd: 中央配置储存，分布式，实现整体服务高可用
* zeromq: 套接字库，增强网络连接的稳健性
* zerorpc: 基于zeromq的RPC服务, 实现所有节点的稳健调用
* redis: 服务数据缓存，实现app无状态的关键，每一个物理机有独立的redis缓存
* redlock: redis分布式锁，实现稳健的缓存读写
* pm2: 进程管理器，实现进程自动重启
* msgpack: 通讯协议，优化过的json
* ansible: 分布式部署


## 优势

* 分布式
* 极致简单, 一个actor非常轻量级，本质就是两个类(handler和remote)加一个自动发现RPC
* Actor逻辑部分（handler），可以直接跟第三方框架结合(比如actor+expressjs, actor+protobuff等)
* 去中心化, 无Master,高可用, 


## 劣势

* 施工中....

## 对比同类产品
对比skynet, pomelo, firefly这类游戏服务器框架

* 最大的区别，没有master (其它类似中master都是关键)
* 不打算提供任何客户端连接方式
* 作者非常懒，所有核心部分都使用第三方稳定组件(RPC, 服务发现, 进程管理)
* 纯基于Promise，彻底并优雅地异步

### rpc

### 客户端

* http
* zeromq/netmq


## 灵感来源

pomelo...