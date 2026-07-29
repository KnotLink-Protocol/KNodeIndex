# MultiTTS

多引擎 TTS 语音合成客户端，通过 KnotLink OpenSocket 协议提供系统 TTS、Edge TTS 和 GPT-SoVITS 三种语音合成引擎的调用接口。

## 仓库地址

- **GitHub**: https://github.com/hxh230802/MultiTTS_Client

## 下载地址

- https://github.com/hxh230802/MultiTTS_Client/releases/latest

## 功能特性

- **系统 TTS** — 调用 Windows 系统自带语音引擎，支持语速/音量/讲述者调节
- **Edge TTS** — 调用 Microsoft Edge 在线语音合成，支持多种神经语音
- **GPT-SoVITS** — 调用本地 GPT-SoVITS 服务，支持参考音频克隆语音

## 快速开始

### 环境要求

- Windows 10+
- Python 3.8+

### 安装

```bash
pip install -r requirements.txt
```

## 技术栈

- **语言** — Python
- **TTS 引擎** — Windows SAPI / Edge TTS / GPT-SoVITS

## 许可证

Copyright © 2026 HXH. All rights reserved.
