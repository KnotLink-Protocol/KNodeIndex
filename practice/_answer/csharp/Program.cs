// KnotLink 练习节点 — 消息提醒（C#）· 参考答案
using System;
using System.Threading.Tasks;
using KnotLink;

class Program
{
    const string APPID = "com.github.knotlink.msgreminder";  // 倒置域名，名字嵌在里面
    const string OPENSOCKET_ID = "show";                     // 接口名（描述性）
    const string SIGNAL_ID = "messageShown";                 // 信号名（描述性）

    static async Task Main()
    {
        var responser = new OpenSocketResponser(APPID, OPENSOCKET_ID);
        var sender = new SignalSender(APPID, SIGNAL_ID);

        responser.OnQuestionAsync = async (data) =>
        {
            // 用 KLUDF 反序列化请求
            var req = new KLKVMap();
            req.Deserialize(data);
            string message = req.Get("msgContext", "默认消息");  // 取出 FuncList 里 args 声明的参数名
            Console.WriteLine($"收到：{message}");               // 业务逻辑：打印
            // 用 KLUDF 打包信号数据：content = 消息内容，time = 显示时间
            var payload = new KLKVMap();
            payload["content"] = message;
            payload["time"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");  // 带上时间戳
            await sender.EmitAsync(payload.Serialize());   // 广播 messageShown 信号
            return "OK";                          // 回复调用方
        };

        Console.WriteLine("消息提醒节点已启动，等待调用……");
        Console.ReadLine();
    }
}
