// KnotLink 练习节点 — 消息提醒（C++）· 参考答案
#include <iostream>
#include <string>
#include <ctime>
#include "OpenSocketResponser.hpp"
#include "SignalSender.hpp"
#include "KLUDF.hpp"

using namespace knotlink;

const std::string APPID = "com.github.knotlink.msgreminder";  // 倒置域名，名字嵌在里面
const std::string OPENSOCKET_ID = "show";                     // 接口名（描述性）
const std::string SIGNAL_ID = "messageShown";                 // 信号名（描述性）

int main() {
    OpenSocketResponser responser(APPID, OPENSOCKET_ID);
    SignalSender sender(APPID, SIGNAL_ID);

    responser.setQuestionHandler([&](const std::string& data) -> std::string {
        // 用 KLUDF 反序列化请求
        KLKVMap req;
        req.deserialize(data);
        std::string message = req.get("msgContext", "默认消息");  // 取出 FuncList 里 args 声明的参数名
        std::cout << "收到：" << message << std::endl;            // 业务逻辑：打印
        // 用 KLUDF 打包信号数据：content = 消息内容，time = 显示时间
        KLKVMap out;
        out["content"] = message;
        char tbuf[32];
        std::time_t now = std::time(nullptr);
        std::strftime(tbuf, sizeof(tbuf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
        out["time"] = tbuf;                // 带上时间戳
        sender.emitt(out.serialize());     // 广播 messageShown 信号
        return "OK";                       // 回复调用方
    });

    std::cout << "消息提醒节点已启动，等待调用……" << std::endl;
    std::cin.get();
    return 0;
}
