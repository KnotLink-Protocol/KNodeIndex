// 消息提醒 · Main.java
// 代码按节点的执行逻辑分成 5 块、已经写好。你要做的不是填零碎的空，
// 而是读懂每块在干什么，并把 ① 里的 APPID 换成你自己。

public class Main {
    // ① 上线：声明身份（AppID + 接口 + 信号）
    static final String APPID = "com.github.你的用户名.msgreminder";   // ← 只有这里换成你自己
    static final String OPENSOCKET_ID = "show";          // 接口名（描述性）
    static final String SIGNAL_ID = "messageShown";      // 信号名（描述性）

    public static void main(String[] args) throws Exception {
        OpenSocketResponser responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
        SignalSender sender = new SignalSender(APPID, SIGNAL_ID);

        responser.setDataListener((data, key) -> {
            // ② 收到调用：用 KLUDF 解析请求，按名取参数
            KLKVMap req = new KLKVMap();
            req.deserialize(data);
            String message = req.get("msgContext", "默认消息");

            // ③ 处理：把消息打印出来
            System.out.println("收到：" + message);

            // ④ 报告：用 KLUDF 打包 content + time，广播 messageShown 信号
            KLKVMap out = new KLKVMap();
            out.put("content", message);
            out.put("time", java.time.LocalDateTime.now().toString());
            sender.emitt(out.serialize());

            // ⑤ 回复：告诉调用方处理成功
            responser.sendBack("OK", key);
        });

        System.out.println("消息提醒节点已启动，等待调用……");
        new java.util.Scanner(System.in).nextLine();
    }
}
