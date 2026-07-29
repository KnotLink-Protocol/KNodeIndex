# USB 序列号获取 (GetUSBSerialNumber)

获取 USB 可移动驱动器的硬件序列号，支持指定盘符查询和列出所有可移动驱动器。

---

## 功能

| 接口 | 说明 |
|------|------|
| `get-serial` | 获取指定盘符的 USB 硬件序列号，参数 `drive`（盘符字母，如 G、H） |
| `list-drives` | 列出所有已连接的可移动驱动器及其序列号，返回 JSON 数组 |

---

## 安装

1. 将 zip 包拖入 KnotHub 操作面板
2. 节点将自动注册为后台服务（`auto_start: true`）

---

## 接口详情

### get-serial — 获取指定盘符的 USB 硬件序列号

- **AppID**: `com.github.hxh230802.getusbserialnumber`
- **SocketID**: `usb`

参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| action | static | 固定为 `get-serial` |
| drive | input | 盘符字母，默认 `G` |

返回：

| 字段 | 说明 |
|------|------|
| serial | USB 硬件序列号 |

### list-drives — 列出所有可移动驱动器

参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| action | static | 固定为 `list-drives` |

返回：

| 字段 | 说明 |
|------|------|
| drives | JSON 数组，每项含 `drive`（盘符）、`name`（卷标）、`serial`（硬件序列号） |

---

## 下载

<https://github.com/KnotLink-Nodes/GetUSBSerialNumber/releases/latest>

---

## 技术栈

- Qt 5 (C++)
- KnotLink SDK (OpenSocketResponser)
- Windows API (DeviceIoControl / IOCTL_STORAGE_QUERY_PROPERTY)

---

## 许可证

MIT

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
