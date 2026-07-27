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
├── practice/            ← 新手训练营（完形填空练习，不进节点索引）
│   ├── README.md        ← 训练营说明（6 步流程）
│   ├── AGENT.md         ← 训练营 agent 指南（结构/规范/各语言API/校验）
│   ├── _exercise/       ← 练习模板：python/js/java/csharp/cpp 各一个自包含项目（含打包 SDK + 构建文件）
│   └── _answer/         ← 参考答案：5 语言各一文件夹，代码+元数据填好（精简无 SDK；_ 前缀校验器忽略）
├── validate-nodes.js    ← 节点格式校验：node validate-nodes.js
├── validate-practice.js ← 训练营练习校验：node validate-practice.js
├── CONTRIBUTING.md      ← 开发者贡献指南
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── validate-practice.yml  ← 练习 PR 自动判题
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
