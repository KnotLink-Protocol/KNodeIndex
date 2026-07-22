# 全局消息提醒 (MsgNotification)

基于 PyQt5 的 Windows 桌面消息提醒工具，通过 [KnotLink](https://github.com/hxh230802/KnotLink) 桥接系统接收来自其他应用的消息，并以动画 Toast 弹窗形式在屏幕顶部居中展示。

## 仓库地址

- **GitHub**: https://github.com/hxh230802/MsgNotification

## 功能特性

- **动画 Toast 弹窗** — 消息从屏幕顶部滑入，停留 3.5 秒后自动滑出消失
- **消息队列管理** — 最多同时展示 5 条消息，超出时排队等待，已有消息消失后自动补位
- **OpenSocket 通信** — 通过 KnotLink 的 OpenSocket 机制接收跨进程消息，实时响应
- **后台静默运行** — 无主窗口，系统托盘常驻，开机自启（安装版）
- **高 DPI 适配** — 支持高分屏显示
- **NSIS 安装包** — 提供完整的安装/卸载体验，支持版本检测与覆盖安装

## 快速开始

### 环境要求

- Windows 10+
- Python 3.8+
- PyQt5

### 安装依赖

```bash
pip install PyQt5
```

> 本项目依赖 `KnotLinkClient_PyQt`（KnotLink 客户端库），请确保该库已安装在同一 Python 环境中。

### 运行

```bash
python src/MsgNotification.py
```

程序启动后将在后台运行，通过 OpenSocket 接口（AppID: `0x00000014`, OpenSocketID: `0x00000010`）等待接收消息。

### 编译资源文件

修改图标等 Qt 资源后，需重新编译 `resources.py`：

```bash
cd src
pyrcc5 icon.qrc -o resources.py
```

## 项目结构

```
MsgNotification/
├── src/
│   ├── MsgNotification.py        # 主入口，创建 QApplication 和 OpenSocket 管理器
│   ├── global_message_toast.py   # Toast 弹窗组件 + 消息队列管理器
│   ├── opensocket_manager.py     # OpenSocket 通信与 Toast 的桥接层
│   ├── resources.py              # 编译后的 Qt 资源（图标）
│   ├── icon.qrc                  # Qt 资源定义文件
│   └── 资源文件编译.bat           # 资源编译脚本
├── assets/
│   └── MsgNotification.ico       # 应用图标
├── scripts/
│   └── nsis/
│       ├── MsgNotification.nsi   # NSIS 安装包脚本
│       ├── compress.bat          # NSIS 打包脚本
│       ├── Icon/                 # 安装包图标
│       ├── AppFile/              # 待打包文件目录
│       └── OtherFile/            # 安装界面素材（许可证、侧边图等）
├── release/                      # 已发布的安装包
├── 程序打包(nuitka).bat           # Nuitka 打包脚本
└── 复制到NSIS待打包文件目录.bat    # 复制 exe 到 NSIS 目录
```

## 打包与发布

### 1. Nuitka 打包

将 Python 程序编译为独立 exe：

```bash
python -m nuitka --onefile --enable-plugin=pyqt5 --windows-disable-console --windows-icon-from-ico="assets/MsgNotification.ico" --output-dir="dist" src/MsgNotification.py
```

或直接运行 `程序打包(nuitka).bat`。

### 2. NSIS 安装包

1. 将 `dist/MsgNotification.exe` 复制到 `scripts/nsis/AppFile/exe/`
2. 使用 NSIS 编译 `MsgNotification.nsi` 生成安装包

```bash
# 或运行
复制到NSIS待打包文件目录.bat
cd scripts/nsis
makensisw.exe MsgNotification.nsi
```

生成的安装包将位于 `scripts/nsis/bin/` 目录。

## OpenSocket 接口

应用通过以下接口接收消息：

| 功能名称 | AppID | OpenSocketID | 参数 |
|---------|-------|--------------|------|
| ShowMsg | `0x00000014` | `0x00000010` | `msgContext` (string) — 消息内容 |

收到消息后，应用会回复 `"OK"` 确认，并在屏幕上展示 Toast 弹窗。

## 技术栈

- **Python 3.8+** — 主语言
- **PyQt5** — GUI 框架（动画、窗口管理）
- **Nuitka** — Python 到 C 编译打包
- **NSIS** — Windows 安装包制作
- **KnotLink OpenSocket** — 跨进程通信

## 许可证

Copyright © 2026 创猿er. All rights reserved.

---

🔗 相关项目：[KnotLink](https://github.com/hxh230802/KnotLink) — 通用桥接系统
