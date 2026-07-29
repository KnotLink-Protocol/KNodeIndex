# 系统监控

> KnotLink 插件节点 — Windows 系统资源实时监控

## 功能简介

采集 Windows 系统资源数据，支持 CPU、内存、磁盘 I/O、网络速率四大类指标，通过 KnotLink 接口实时对外提供。

## 接口列表

| 接口 | 说明 | 返回字段 |
|------|------|----------|
| `get-cpu` | CPU 总使用率及各核心使用率 | `cpu_total`, `cpu_cores` |
| `get-memory` | 内存总量、已用、可用、使用率 | `memory_total_bytes`, `memory_used_bytes`, `memory_available_bytes`, `memory_usage_percent` |
| `get-disk` | 磁盘分区信息及读写速率 | `disk_partitions`, `disk_read_bytes_per_sec`, `disk_write_bytes_per_sec` |
| `get-network` | 各网卡收发速率及总速率 | `network_total_recv_bytes_per_sec`, `network_total_send_bytes_per_sec`, `network_interfaces` |
| `get-all` | 以上全部数据 | 以上所有字段 |

## 编译

```bash
g++ -std=c++17 system_monitor_win_bytes.cpp -lpdh -liphlpapi -lws2_32 -static -o monitor.exe
```

## 下载

- 最新版本：[GitHub Releases](https://github.com/KnotLink-Nodes/system_monitor_win/releases/latest)
- 节点市场：[knotlink.cn/nodes](https://knotlink.cn/nodes)

## 许可证

MIT
