# KnotLink 练习节点 — 消息提醒（Python）· 参考答案
# 运行前：pip install knotlink
from knotlink import OpenSocketResponser, SignalSender, KLKVMap
import time

APPID = "com.github.knotlink.msgreminder"  # 倒置域名，名字嵌在里面（这里是 knotlink）
OPENSOCKET_ID = "show"                      # 接口名（描述性）
SIGNAL_ID = "messageShown"                  # 信号名（描述性）

sender = SignalSender(APPID, SIGNAL_ID)


def handle_request(data: str) -> str:
    # 用 KLUDF 把请求（key=value;… 格式）反序列化成键值对
    req = KLKVMap()
    req.deserialize(data)
    message = req.get("msgContext", "默认消息")   # 取出 FuncList 里 args 声明的参数名
    print(f"收到：{message}")                     # 业务逻辑：把 message 打印出来
    # 用 KLUDF 打包信号数据：content = 消息内容，time = 显示时间
    out = KLKVMap()
    out["content"] = message
    out["time"] = time.strftime("%Y-%m-%d %H:%M:%S")  # 带上时间戳
    sender.emitt(out.serialize())                 # 广播 messageShown 信号
    return "OK"                                    # 回复调用方


responser = OpenSocketResponser(APPID, OPENSOCKET_ID)
responser.set_RecvFunc(handle_request)   # 回调的返回值会自动回传给调用方

print("消息提醒节点已启动，等待调用……")
input("按回车退出。\n")
