### kafka是什么

kafka是一个实时数据处理系统（消息中间件、消息队列）、可以横向扩展、高可靠

、响应快

### 为什么需要消息中间件

主要作用

- 解耦消息的生产和消费
- 缓冲

### 数据结构

Kafka会对数据进行**持久化存储**（至于存放多长时间，这是可以配置的），消费者端会记录一个**offset**，表明该消费者当前消费到哪条数据，所以下次消费者想继续消费，只需从offset+1的位置继续消费就好了，消费者甚至可以通过调整offset的值，重新消费以前的数据

这样简单的实现存在许多问题：

- Topic很多，只订阅了topic A的消费者要在有多个topic的队列中寻找消息
- 吞吐量低，所有消息放在一条队列

优化

#### 分布存储

Kafka引入了**Partition**的概念，也就是采用多条队列， 每条队列里面的消息都是相同的topic：

![Partition](https://pic3.zhimg.com/80/v2-e9a2454157eb1a39ec4efe0664d1b766_720w.jpg)

Partition的设计解决了上面提到的两个问题：

- **纯Topic队列**。一个队列只有一种topic，消费者再也不用担心会碰到不是自己想要的topic的消息了。
- **提高吞吐量**。不同topic的消息交给不同队列去存储，再也不用以一敌十了。



#### Broker集群

为了解决高可用问题，我们需要**集群**

![](https://pic2.zhimg.com/80/v2-7fa0c347ac6811e06baea17eb2260c3d_720w.jpg)

每个partition不再只有一个，而是有一个**leader**(红色)和多个**replica**(蓝色)，生产者根据消息的topic和key值，确定了消息要发往哪个partition之后（假设是p1），会找到partition对应的leader(也就是broker2里的p1)，然后将消息发给leader，leader负责消息的写入，并与其余的replica进行同步。

一旦某一个partition的leader挂掉了，那么只需提拔一个replica出来，让它成为leader就ok了，系统依旧可以正常运行。

通过Broker集群的设计，我们不仅解决了系统高可用的问题，还进一步提升了系统的吞吐量，因为replica同样可以为消费者提供数据查找的功能。

### 核心API

Kafka有四个核心API：

- **Producer API（生产者API）**允许应用程序**发布**记录流至一个或多个kafka的**topics（主题）**。
- **Consumer API（消费者API）**允许应用程序**订阅一个或多个topics（主题）**，并处理所产生的对他们记录的数据流。
- **Streams API（流API）**允许应用程序充当**流处理器**，从一个或多个**topics（主题）**消耗的输入流，并产生一个输出流至一个或多个输出的topics（主题），**有效地变换所述输入流，以输出流**。
-  **Connector API（连接器API）**允许构建和运行kafka **topics（主题）连接到现有的应用程序或数据系统中重用生产者或消费者**。例如，关系数据库的连接器可能捕获对表的每个更改。

### Topics主题 和 partitions分区

### 操作

安装

```js
brew install kafka
```

进入程序目录

```js
cd /usr/local/etc/kafka/
```

目录下有zookeeper和kafka配置文件

启动

```js
cd /usr/local/etc/kafka

zookeeper-server-start zookeeper.properties &
kafka-server-start server.properties &
```

停止

```js
cd /usr/local/Cellar/kafka/3.0.0/bin

kafka-server-stop
zookeeper-server-stop
```

创建topic

查看topic

```js
./kafka-topics --list --bootstrap-server localhost:9092
```

### Node kafka

#### KafkaClient

连接kafka

参数

- `kafkaHost` : kafka服务地址
- `connectTimeout` : 连接超时时间，default: `10000`
- `requestTimeout` : 请求超时时间， default: `30000`
- `autoConnect` : 自动连接， default: `true`
- `connectRetryOptions` : object hash that applies to the initial connection. see [retry](https://www.npmjs.com/package/retry) module for these options.
- `idleConnection` : allows the broker to disconnect an idle connection from a client (otherwise the clients continues to O after being disconnected). The value is elapsed time in ms without any data written to the TCP socket. default: 5 minutes
- `reconnectOnIdle` : when the connection is closed due to client idling, client will attempt to auto-reconnect. default: true
- `maxAsyncRequests` : maximum async operations at a time toward the kafka cluster. default: 10
- `sslOptions`: **Object**, options to be passed to the tls broker sockets, ex. `{ rejectUnauthorized: false }` (Kafka 0.9+)
- `sasl`: **Object**, SASL authentication configuration (only SASL/PLAIN is currently supported), ex. `{ mechanism: 'plain', username: 'foo', password: 'bar' }` (Kafka 0.10+)

```js
const client = new kafka.KafkaClient({kafkaHost: '10.3.100.196:9092'});
```

#### Producer

生产者

Producer(KafkaClient, [options], [customPartitioner])

