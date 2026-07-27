// 消息提醒 · Program.cs
// 代码按节点的执行逻辑分成 5 块、已经写好。你要做的不是填零碎的空，
// 而是读懂每块在干什么，并把 ① 里的 APPID 换成你自己。
using System;
using System.Threading.Tasks;
using KnotLink;

class Program
{
    // ① 上线：声明身份（AppID + 接口 + 信号）
    const string APPID = "com.github.你的用户名.msgreminder";   // ← 只有这里换成你自己
    const string OPENSOCKET_ID = "show";          // 接口名（描述性）
    const string SIGNAL_ID = "messageShown";      // 信号名（描述性）

    static async Task Main()
    {
        var responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
        var sender = new SignalSender(APPID, SIGNAL_ID);

        responser.OnQuestionAsync = async (data) =>
        {
            // ② 收到调用：用 KLUDF 解析请求，按名取参数
            var req = new KLKVMap();
            req.Deserialize(data);
            string message = req.Get("msgContext", "默认消息");

            // ③ 处理：把消息打印出来
            Console.WriteLine($"收到：{message}");

            // ④ 报告：用 KLUDF 打包 content + time，广播 messageShown 信号
            var payload = new KLKVMap();
            payload["content"] = message;
            payload["time"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            await sender.EmitAsync(payload.Serialize());

            // ⑤ 回复：告诉调用方处理成功
            return "OK";
        };

        Console.WriteLine("消息提醒节点已启动，等待调用……");
        Console.ReadLine();
    }
}
