# KNodeIndex — Agent Guide

KnotLink 节点注册仓库。开发者在此提交节点，网站通过 git submodule 引用。

## 仓库结构

```
KNodeIndex/
├── plugin/              ← 插入式节点（由 KnotHub 启动管理）
│   └── 节点名-作者/
│       ├── plugin_manifest.json   ← 节点元信息（必填）
│       ├── FuncList.json          ← 接口定义（必填）
│       ├── logo.png               ← 节点图标 ≥128×128（必填）
│       └── README.md              ← 说明文档，含官网/下载链接（必填）
├── standalone/          ← 独立式节点（独立进程运行）
│   └── 节点名-作者/
│       ├── standalone_manifest.json
│       ├── FuncList.json
│       ├── logo.png
│       └── README.md
├── _template/           ← 新节点模板，开发者复制此目录开始
│   ├── plugin_manifest.json
│   ├── FuncList.json
│   ├── logo.png         ← 占位图，替换为实际 logo
│   └── README.md
├── validate-nodes.js    ← 格式校验脚本：node validate-nodes.js
├── CONTRIBUTING.md      ← 开发者贡献指南
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

## 节点类型

| 类型 | 目录 | 说明 |
|------|------|------|
| 插入式 | `plugin/` | 由 KnotHub 启动，管理节点生命周期 |
| 独立式 | `standalone/` | 独立进程运行，通过 TCP OpenSocket 协议通信 |

## FuncList.json 规范

```json
{
  "appName": "节点名称",
  "specVersion": "1.0",         // 遵循的规范版本 — 必填
  "manifestVersion": "1.0.0",  // 清单自身版本号 — 必填
  "openSocket": { ... },       // 对外暴露的调用接口（可选）
  "signal": { ... }            // 对外发送的信号（可选）
}
```

- `returns` 格式：`[["描述", "字段名"], ...]`（数组的数组）
- `signal.returns` 格式：`{ "字段名": { "description": "...", "verification": "..." } }`（对象）
- AppID 需全局唯一，格式为倒置域名（如 `com.example.myapp`）；OpenSocketID / SignalID 使用小写语义化名称（如 `search`、`showmsg`）

## 提交前校验

```bash
node validate-nodes.js    # 退出码 0 = 通过
```

## 关联项目

- Website: `github.com/KnotLink-Protocol/KnotLink-Website`（通过 submodule 引用本仓库）
- 文档: `https://docs.knotlink.cn`
- 协议核心: `github.com/KnotLink-Protocol/KnotLink`
- SDK: `github.com/KnotLink-Protocol/KnotLinkSDK`
