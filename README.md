# FY3DDataServer
FY3D数据服务

## 模块划分
### Daemon 守护模块
####功能描述
**与配置文件（数据库/文件）配合 维护相关进程的启停。包括如下三个方面：**
<p>**1. 进程守护功能**
<p>**2. 对外服务功能；（RESTfulServer 包括查看、控制、帮助等）**
<p>**3. 运行日志记录与管理**
#####进程守护

#####对外服务
<p>**守护进程的API包括如下功能：**
    1、获取API列表
        - GET /api/daemon
    2、获取所有进程的状态（包括：name、pid、status、cpu、mem、启动次数等）
        - GET /api/daemon/process
    3、获取指定进程的状态（包括：name、pid、status、cpu、mem、启动次数等）
        - GET /api/daemon/process?name=[processname]
    4、控制指定进程的状态（包括：启动、挂起、重启等）
        - PUT /api/daemon/process/:processName/:status ('start'、'stop'、'restart')
    5、控制所有进程的状态（包括：启动、挂起、重启等）
        - PUT /api/daemon/process/:status ('start'、'stop'、'restart')
#####运行日志

