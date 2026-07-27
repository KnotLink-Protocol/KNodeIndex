// KnotLink 练习节点 — 消息提醒（Java）· 参考答案
// SDK（含训练营补充的 KLKVMap）见 _exercise/java/knotlink-sdk/

public class Main {
    static final String APPID = "com.github.knotlink.msgreminder";  // 倒置域名，名字嵌在里面
    static final String OPENSOCKET_ID = "show";                     // 接口名（描述性）
    static final String SIGNAL_ID = "messageShown";                 // 信号名（描述性）

    public static void main(String[] args) throws Exception {
        OpenSocketResponser responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
        SignalSender sender = new SignalSender(APPID, SIGNAL_ID);

        responser.setDataListener((data, key) -> {
            // 用 KLUDF 反序列化请求
            KLKVMap req = new KLKVMap();
            req.deserialize(data);
            String message = req.get("msgContext", "默认消息");  // 取出 FuncList 里 args 声明的参数名
            System.out.println("收到：" + message);              // 业务逻辑：打印
            // 用 KLUDF 打包信号数据：content = 消息内容，time = 显示时间
            KLKVMap out = new KLKVMap();
            out.put("content", message);
            out.put("time", java.time.LocalDateTime.now().toString());  // 带上时间戳
            sender.emitt(out.serialize());              // 广播 messageShown 信号
            responser.sendBack("OK", key);              // 回复调用方
        });

        System.out.println("消息提醒节点已启动，等待调用……");
        new java.util.Scanner(System.in).nextLine();
    }
}
