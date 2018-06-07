# P008-EthereumMapping

> Project Name : P008-EthereumMapping
>
> Author : WildSaoFeng
>
> Abstract : Total Supply Analysis
>
> Last Edit : 2018-06-08 05:31:27
>
> Version : 2.1

## 1. 环境配置

需装软件
> Node (Version 6.11.2)
>
> MongoDB (Version 3.6.2)
>
> Npm

安装依赖

```
git clone https://github.com/WildSaoFeng/P008-EthereumMapping.git

cd P008-EthereumMapping

npm install
```

Shell中开启MongoDB

```
sudo mongod

// 如果需要用Shell直接CRUL DB 则：
sudo mongo

```
## 2. 修改程序关键参数（如果有需要）

#### 数据库位置

可根据实际情况修改

```
Line 43: let databaseURL = 'mongodb://localhost:27017/ethTotalSupplyAnalysis';
```

#### 全节点选择

目前采用自己申请的Infura API，同一API Key也可以用于其他以太网络

```
Line 79:   let ethNodeURL = "https://mainnet.infura.io/8Sz0lITQzrM5dS9o6rb4";
```

#### ERC20 Token Balance 查询API
目前采用tokenBalance这个网站的API获取所需ERC20代币的余额，可更换，采用http/https请求获取
```
Line 158: let tokenBalanceURL = 'api.tokenbalance.com/balance/' + contractAddr + '/' + addrList[i];
```

#### 全节点连接方式

目前用HTTP访问API，测算速度大概是1000IO/15s，算完500万区块大概要55个月...

连接全节点后用本地IPC通信，会大幅提升速度：

```
Line 80:  web3 = new Web3(new Web3.providers.HttpProvider(ethNodeURL));

web3 = new Web3(new Web3.providers.IPCProvider(ethNodeURL));
```

## 3. 开始分析

Index.js为测试文件，请用main.js进行运算

```
node main.js
```

## 附录

* 使用了部分ECMA Script 6语法，若编辑器显示错误，请调整语法分析模式

* 02文件夹为一开始尝试写Python爬虫程序，但快写完时因Etherscan不提供全信息，放弃...

* 03文件夹目前10页左右，包含60%左右遇到的坑... 还会不断补充及美化
