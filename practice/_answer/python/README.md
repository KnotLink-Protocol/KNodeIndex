> 📖 **这是参考答案** —— 建议先自己动手填 [`_exercise/`](../_exercise/)，卡住了再来对照。
> 直接抄能过校验，但你就没「亲手走一遍」——而那正是训练营的意义。

# 消息提醒

一个把收到的消息打印到控制台的 KnotLink 示例节点。

> 演示两种通信模式：
> **接口（Responser）** —— 被别的节点调用时，在控制台打印消息并回复 `OK`；
> **信号（Sender）** —— 打印后广播一个 `messageShown` 信号，携带消息内容。

## 官方网站 / 下载

- **下载地址**: https://github.com/KnotLink-Protocol/KNodeIndex

## 功能

- **ShowMsg（接口）** — 接收参数 `msgContext`，在控制台输出消息内容，回复 `OK`
- **messageShown（信号）** — 消息显示后广播，返回字段 `content`（已显示的消息内容）、`time`（消息显示的时间）

## 许可证

Copyright © 2026 KnotLink.
