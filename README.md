# cosmos

实验中....
[experimental now]
a node js distributed game server framework


实验性的游戏服务器框架，
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


## 关键的第三方组件/库:

* etcd: 中央配置储存，分布式，实现整体服务高可用
* zeromq: 套接字库，增强网络连接的稳健性
* zerorpc: 基于zeromq的RPC服务, 实现所有节点的稳健调用
* redis: 服务数据缓存，实现app无状态的关键，每一个物理机有独立的redis缓存
* redlock: redis分布式锁，实现稳健的缓存读写
* bluebird/promise: NodeJS回调优化，实现类协程
* supervisord: 进程管理器，实现单进程高可用
* messagepack: 通讯协议，优化过的json
* ansible: 分布式部署




## 节点

### rpc

### 客户端

* http
* zeromq/netmq



## 灵感来源

pomelo...