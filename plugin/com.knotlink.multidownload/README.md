# MultiDownload

> KnotLink 插件 — IDM 风格多线程异步分块 HTTP 下载器

## 功能

- **多线程分块下载** — 自动将文件切分为多个分块并行下载，显著提升大文件下载速度
- **TLS 指纹模拟** — 通过 wreq 模拟浏览器 TLS 指纹，绕过反爬限制
- **Range 请求支持** — 支持断点续传，自动探测服务端是否支持 Range
- **动态加速** — 自动监测速度稳定性，动态增加并发连接数
- **KnotLink 集成** — 通过 OpenSocket 接收下载请求，Signal 异步推送进度/完成/失败

## KnotLink 接口

### OpenSocket: `download`

发起下载请求，立即返回 `OK`，下载进度通过 Signal 异步推送。

| 参数 | 类型 | 说明 |
|------|------|------|
| cmd | static | 固定为 `start`，也支持 `ping` 做健康检查 |
| url | input | 下载 URL |
| dest | input | 目标文件完整路径 |
| reqID | input | 请求 ID，信号中原样带回 |
| threads | optional | 下载线程数：4/8/16/32 |

### Signal 广播

| 信号 | 说明 |
|------|------|
| `progress` | 进度变更（>5%）时广播：reqID, percent, downloaded, total, speed |
| `completed` | 下载完成：reqID, path, size |
| `failed` | 下载失败：reqID, error |

## 技术栈

- Python ≥ 3.11
- wreq (TLS 指纹模拟)
- asyncio (异步 I/O)
- Nuitka (编译为独立 .exe)

## 许可

GPL-3.0-only — 参见 [LICENSE](../../LICENSE)
