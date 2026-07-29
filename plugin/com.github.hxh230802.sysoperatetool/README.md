# 系统操作工具

> KnotLink 插件节点 — 通过远程调用执行 Windows 系统操作

## 功能简介

提供关机、睡眠、锁屏、音量控制、窗口管理等 9 种系统操作接口，支持倒计时和静默执行模式。

## 接口列表

| 接口 | 说明 | 关键参数 |
|------|------|----------|
| `shutdown` | 定时关机 | `delay` 倒计时秒数，`silence` 是否静默 |
| `sleep` | 系统睡眠 | `delay` 倒计时秒数，`silence` 是否静默 |
| `lockScreen` | 锁屏（黑色遮罩） | `delay` 倒计时秒数，`silence` 是否静默 |
| `getSysVolume` | 获取系统音量 | 无，返回 `volume`（0~100） |
| `setSysVolume` | 设置系统音量 | `vol` 音量值（0~100） |
| `getSystemMuteStatus` | 查询静音状态 | 无，返回 `muted`（1=静音） |
| `setSystemMuteStatus` | 切换静音 | `status`（0=取消，1=静音） |
| `findWindowByTitle` | 查找窗口句柄 | `title` 窗口标题，返回 `hwnd` |
| `setWindowState` | 设置窗口状态 | `hwnd` 句柄，`state` 状态（隐藏/显示/最小化/最大化/恢复） |

## 下载

- 最新版本：[GitHub Releases](https://github.com/KnotLink-Nodes/sysOperateTool/releases/latest)
- 节点市场：[knotlink.cn/nodes](https://knotlink.cn/nodes)

## 许可证

MIT
