// KnotLink 练习节点 — 消息提醒（JavaScript / Node）· 参考答案
// SDK（含训练营补充的 KLKVMap）见 _exercise/javascript/knotlink/
const OpenSocketResponser = require('./knotlink/OpenSocketResponser');
const SignalSender = require('./knotlink/SignalSender');
const KLKVMap = require('./knotlink/KLKVMap');

const APPID = "com.github.knotlink.msgreminder";  // 倒置域名，名字嵌在里面（这里是 knotlink）
const OPENSOCKET_ID = "show";                     // 接口名（描述性）
const SIGNAL_ID = "messageShown";                 // 信号名（描述性）

const responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
const sender = new SignalSender(APPID, SIGNAL_ID);

responser.on('request', (questionID, data) => {
    // 用 KLUDF 反序列化请求
    const req = new KLKVMap();
    req.deserialize(data);
    const message = req.get("msgContext", "默认消息");  // 取出 FuncList 里 args 声明的参数名
    console.log(`收到：${message}`);                    // 业务逻辑：打印 message
    // 用 KLUDF 打包信号数据：content = 消息内容，time = 显示时间
    const out = new KLKVMap();
    out.set("content", message);
    out.set("time", new Date().toISOString());  // 带上时间戳
    sender.emitt(out.serialize());        // 广播 messageShown 信号
    responser.sendBack("OK", questionID); // 回复调用方
});

console.log("消息提醒节点已启动，等待调用……");
