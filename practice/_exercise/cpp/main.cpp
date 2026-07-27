// 消息提醒 · main.cpp
// 代码按节点的执行逻辑分成 5 块、已经写好。你要做的不是填零碎的空，
// 而是读懂每块在干什么，并把 ① 里的 APPID 换成你自己。
#include <iostream>
#include <string>
#include <ctime>
#include "OpenSocketResponser.hpp"
#include "SignalSender.hpp"
#include "KLUDF.hpp"

using namespace knotlink;

// ① 上线：声明身份（AppID + 接口 + 信号）
const std::string APPID = "com.github.你的用户名.msgreminder";   // ← 只有这里换成你自己
const std::string OPENSOCKET_ID = "show";          // 接口名（描述性）
const std::string SIGNAL_ID = "messageShown";      // 信号名（描述性）

int main() {
    OpenSocketResponser responser(APPID, OPENSOCKET_ID);
    SignalSender sender(APPID, SIGNAL_ID);

    responser.setQuestionHandler([&](const std::string& data) -> std::string {
        // ② 收到调用：用 KLUDF 解析请求，按名取参数
        KLKVMap req;
        req.deserialize(data);
        std::string message = req.get("msgContext", "默认消息");

        // ③ 处理：把消息打印出来
        std::cout << "收到：" << message << std::endl;

        // ④ 报告：用 KLUDF 打包 content + time，广播 messageShown 信号
        KLKVMap out;
        out["content"] = message;
        char tbuf[32];
        std::time_t now = std::time(nullptr);
        std::strftime(tbuf, sizeof(tbuf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
        out["time"] = tbuf;
        sender.emitt(out.serialize());

        // ⑤ 回复：告诉调用方处理成功
        return "OK";
    });

    std::cout << "消息提醒节点已启动，等待调用……" << std::endl;
    std::cin.get();
    return 0;
}
