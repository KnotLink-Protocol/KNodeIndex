# 贡献节点指南

感谢你为 KnotLink 贡献节点！提交前请确保符合以下规范。

## 目录结构

每个节点一个文件夹，放在对应类型目录下：

```
plugin/              ← 插入式节点（由 KnotHub 启动管理）
│   └── YourNode-作者名/  ← 文件夹命名：节点名-作者
standalone/          ← 独立式节点（独立进程运行）
    └── YourNode-作者名/
```

## 必需文件

| 文件 | 说明 | 插入式 | 独立式 |
|------|------|:---:|:---:|
| `plugin_manifest.json` | 节点元信息 | ✅ 必须 | — |
| `standalone_manifest.json` | 节点元信息 | — | ✅ 必须 |
| `FuncList.json` | 功能接口定义 | ✅ 必须 | ✅ 必须 |
| `logo.png` | 节点图标（≥128×128） | ✅ 必须 | ✅ 必须 |
| `README.md` | 使用说明（须包含官网/下载链接，无需列出接口——接口在 FuncList.json 中定义） | ✅ 必须 | ✅ 必须 |

## plugin_manifest.json 格式

```json
{
  "app_id": "0x00000014",        // 十六进制 AppID，全局唯一
  "plugin_name": "节点名称",      //
  "author": "你的名字",           //
  "version": "v1.0.0",           //
  "description": "一句话描述",    //
  "auto_start": "true",          // 是否开机自启
  "exe_path": "app.exe"          // 可执行文件名
}
```

## FuncList.json 格式

```json
{
  "appName": "节点名称",
  "specVersion": "1.0",
  "manifestVersion": "1.0.0",
  "openSocket": {
    "接口名": {
      "appID": "0x00000014",
      "openSocketID": "0x00000010",
      "description": "接口描述",
      "args": {
        "参数名": {
          "type": "input",
          "description": "参数说明",
          "defaultVal": "默认值"
        }
      },
      "returns": []
    }
  },
  "signal": {
    "信号名": {
      "appID": "0x00000014",
      "signalID": "0x00000011",
      "description": "信号描述",
      "returns": {
        "字段名": {
          "description": "字段说明",
          "verification": "校验值（可选）"
        }
      }
    }
  }
}
```

## PR 提交流程

1. Fork 本仓库
2. 在 `plugin/` 或 `standalone/` 下创建节点文件夹
3. 放入必需文件
4. 本地验证：`node build-nodes.js`（确保无报错）
5. 提交 PR 至 [KNodeIndex](https://github.com/KnotLink-Protocol/KNodeIndex)，标题格式：`[节点] 节点名 - 类型`

### 顶层字段

| 字段 | 必填 | 说明 |
|------|:---:|------|
| `appName` | 是 | 节点名称 |
| `specVersion` | 是 | 遵循的 KnotLink 规范版本（如 `"1.0"`） |
| `manifestVersion` | 是 | 本 FuncList 自身的版本号（如 `"1.0.0"`） |
| `openSocket` | 否 | 对外暴露的调用接口 |
| `signal` | 否 | 对外发送的信号 |

## AppID / OpenSocketID 分配

为避免冲突，请先在 [Issues](https://github.com/your-org/knotlink-nodes/issues) 中申请 ID 范围，或在 PR 描述中注明使用的 ID。已分配 ID 列表见 [`APPID.md`](APPID.md)。

## 验证清单

提交前确认：

- [ ] 文件夹命名：`节点名-作者`
- [ ] manifest 字段完整
- [ ] FuncList 中的 `appID` 与 manifest 中 `app_id` 一致
- [ ] `logo.png` 不小于 128×128
- [ ] `node build-nodes.js` 无报错
- [ ] 在本地浏览器中预览正常
