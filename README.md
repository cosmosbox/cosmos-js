# cosmosky
[experimental now]
a distributed game server framework


应用到的第三方组件/库:

* etcd
* zerorpc
* zeromq
* supervisord + redis (redlock)
* ansible: 分布式部署
实验性的游戏服务器框架，
希望：

* 尽可能的少写代码：不要忙死在折腾的事情上
* 尽可能的使用稳定的第三方库：不重复造轮子
* 尽可能的精简架构：越精简的架构越不易出问题

去实现：

* 超级简单的使用
* 分布式：多台机器可不是
* master高可用
* 任意逻辑服务器被kill自动重启
* 无状态：进程被kill的影响降到最低
