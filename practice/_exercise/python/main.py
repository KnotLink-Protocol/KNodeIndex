# 消息提醒 · main.py
# 代码按节点的执行逻辑分成 5 块、已经完整写好并逐块讲解。
# 你要做的：读懂每块在干什么，并把 ① 里的 APPID 换成你自己。
from knotlink import OpenSocketResponser, SignalSender, KLKVMap
import time

# ① 上线：声明身份（AppID + 接口 + 信号），作为「回复者」连上 KnotLink
APPID = "com.github.你的用户名.msgreminder"   # ← 只有这里换成你自己（倒置域名 + 你的用户名）
OPENSOCKET_ID = "show"          # 接口名（描述性）
SIGNAL_ID = "messageShown"      # 信号名（描述性）
responser = OpenSocketResponser(APPID, OPENSOCKET_ID)
sender = SignalSender(APPID, SIGNAL_ID)


def handle_request(data: str) -> str:
    # ② 收到调用：用 KLUDF 把 key=value 请求解析成键值对，按名取参数
    req = KLKVMap()
    req.deserialize(data)
    message = req.get("msgContext", "默认消息")

    # ③ 处理：把消息打印出来（真实节点这里可以弹窗、发通知……）
    print(f"收到：{message}")

    # ④ 报告：用 KLUDF 打包 content + time，广播 messageShown 信号
    out = KLKVMap()
    out["content"] = message
    out["time"] = time.strftime("%Y-%m-%d %H:%M:%S")
    sender.emitt(out.serialize())

    # ⑤ 回复：告诉调用方处理成功
    return "OK"


responser.set_RecvFunc(handle_request)   # 回调的返回值会自动回传给调用方
print("消息提醒节点已启动，等待调用……")
input("按回车退出。\n")
