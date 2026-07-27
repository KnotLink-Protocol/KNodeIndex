// 消息提醒 · main.js
// 代码按节点的执行逻辑分成 5 块、已经写好。你要做的不是填零碎的空，
// 而是读懂每块在干什么，并把 ① 里的 APPID 换成你自己。
const OpenSocketResponser = require('./knotlink/OpenSocketResponser');
const SignalSender = require('./knotlink/SignalSender');
const KLKVMap = require('./knotlink/KLKVMap');

// ① 上线：声明身份（AppID + 接口 + 信号），作为「回复者」连上 KnotLink
const APPID = "com.github.你的用户名.msgreminder";   // ← 只有这里换成你自己
const OPENSOCKET_ID = "show";          // 接口名（描述性）
const SIGNAL_ID = "messageShown";      // 信号名（描述性）
const responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
const sender = new SignalSender(APPID, SIGNAL_ID);

responser.on('request', (questionID, data) => {
    // ② 收到调用：用 KLUDF 解析请求，按名取参数
    const req = new KLKVMap();
    req.deserialize(data);
    const message = req.get("msgContext", "默认消息");

    // ③ 处理：把消息打印出来
    console.log(`收到：${message}`);

    // ④ 报告：用 KLUDF 打包 content + time，广播 messageShown 信号
    const out = new KLKVMap();
    out.set("content", message);
    out.set("time", new Date().toISOString());
    sender.emitt(out.serialize());

    // ⑤ 回复：告诉调用方处理成功
    responser.sendBack("OK", questionID);
});

console.log("消息提醒节点已启动，等待调用……");
