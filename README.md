# cosmosky
[experimental now]
a distributed game server framework


etcd + zerorpc + ansible + supervisord + redis (redlock)
实验性的游戏服务器框架，
希望：

* 尽可能的少写代码
* 尽可能的使用第三方库，不重复造轮子

去实现：

* 超级简单的使用
* master高可用
* 任意逻辑服务器被kill自动重启
* 无状态：进程被kill的影响降到最低
