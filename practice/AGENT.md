# KnotLink 训练营（practice/）— Agent Guide

新手用「完形填空」式教学走一遍 KnotLink 接入全流程的**练习场**。产物落在 `practice/<用户名>/`，**不进节点索引、不上官网**。

## 这是什么

- 以 **MsgNotification（消息提醒）** 为原型的教学节点，演示 KnotLink 两种通信模式：
  - **接口（Responser）** `ShowMsg`：被调用时打印消息、回 `OK`；
  - **信号（Sender）** `messageShown`：广播 `content` + `time`。
- 教学法：代码**完整给出 + 逐块讲解**（按执行逻辑分 ①上线 → ②KLUDF解析 → ③处理 → ④KLUDF打包广播 → ⑤回复 五块），学习者读懂流程、只把 AppID 换成自己；再填 FuncList / manifest；提 PR。**抓流程，不抠零碎。**

## 目录结构

```
practice/
├── README.md          ← 训练营教程（6 步，面向学习者）
├── AGENT.md           ← 本文件
├── _exercise/         ← 练习模板：5 个自包含项目，学习者拷一个语言文件夹
│   ├── python/        main.py · plugin_manifest.json · FuncList.json · README.md · logo.png · requirements.txt · knotlink/(打包SDK)
│   ├── javascript/    main.js · package.json · …元数据… · knotlink/(含补充 KLKVMap.js)
│   ├── java/          Main.java · build.sh · …元数据… · knotlink-sdk/(含补充 KLKVMap.java)
│   ├── csharp/        Program.cs · msgreminder.csproj · …元数据… · knotlink/
│   └── cpp/           main.cpp · CMakeLists.txt · …元数据… · knotlink/
└── _answer/           ← 参考答案：5 语言各一文件夹，代码+元数据填好（精简，无打包 SDK）
```

`_` 前缀目录被所有扫描器忽略（`_exercise` / `_answer` 不会被当成练习提交）。

## 规范（务必遵守）

- **AppID**：新格式 = 倒置域名并嵌用户名 `com.github.<用户名>.msgreminder`（模板占位 `com.github.你的用户名.msgreminder`，校验器会拦未个性化的）。旧格式 `0x`+8位十六进制仍兼容。
- **openSocketID / signalID**：描述性名 `show` / `messageShown`。
- **清单**：`plugin_manifest.json`（字段用 `plugin_name`）+ `FuncList.json`（大小写如此）——与仓库真实节点、`validate-nodes.js` 一致。
- **数据格式**：请求与信号都走 **KLUDF（`KLKVMap`）** 标准化（`deserialize` / `get` / `serialize`）。
- **跨文件一致性**：代码里的 `APPID` == `manifest.app_id` == FuncList 接口/信号的 `appID`；`openSocketID` / `signalID` 与代码一致；`plugin_name` == `appName`。

## 各语言 SDK API（写代码块时对照真实 SDK）

| 语言 | 回复者设回调 | 回复方式 | 信号 | KV 工具 |
|------|-------------|---------|------|--------|
| Python | `set_RecvFunc(cb)` | return 自动回传 | `SignalSender(A,S).emitt()` | `KLKVMap`（SDK 自带）|
| JS | `on('request',(qid,data)=>…)` | 显式 `sendBack(r, qid)` | `emitt()` | `KLKVMap.js`（训练营补充）|
| Java | `setDataListener((data,key)->…)` | 显式 `sendBack(r, key)` | `emitt()` | `KLKVMap.java`（训练营补充）|
| C# | `OnQuestionAsync = async d=>…` | return `Task<string>` | `EmitAsync()` | `KLKVMap`（SDK 自带 `KLUDF.cs`）|
| C++ | `setQuestionHandler(h)` | return 自动回传 | `emitt()` | `KLKVMap`（SDK 自带 `KLUDF.hpp`）|

> JS / Java 的**官方 SDK 没有 KLKVMap**，训练营在打包 SDK 里补了 `KLKVMap.js` / `KLKVMap.java`（文件头注明是补充）。

## 校验与 CI

- `../validate-practice.js`：语言无关判题——占位符残留、必需文件、JSON 可解析、appID 格式/未个性化、跨文件一致性、`signal.messageShown.returns` 对象格式、README 含链接、logo 大小。退出码 0/1，结果写 `$GITHUB_STEP_SUMMARY`。
- `../.github/workflows/validate-practice.yml`：改动 `practice/**` 的 PR 触发。结构校验（硬门禁）+ Python/JS 语法（硬）+ Java/C#/C++ 编译（best-effort，因 CI 是 Linux 不阻断）。fork PR 只读 token，不发评论，靠红/绿勾 + Job Summary。

## 隔离

`build-nodes.js`（官网数据）和 `validate-nodes.js`（真节点校验）都**只扫 `plugin/`、`standalone/`**——`practice/` 天然隐形，改这里不影响官网和节点索引。

## 扩展

- **加语言**：在 `_exercise/` 新建 `<lang>/`，放入口 + 4 元数据（复制现成 cloze）+ 打包该语言 SDK + 构建文件；把入口文件名加进 `validate-practice.js` 的 `ENTRY_FILES` 和 workflow 的编译分支；`_answer/` 加对应填好版。
- **改教学节点**：`plugin_manifest.json` / `FuncList.json` 5 语言一致改；代码保持 ①~⑤ 逻辑分块；信号字段变动要同步改 FuncList `signal.returns` 和各语言 `out` 的打包。
- 任何改动后：`node validate-practice.js` + 造一个 `practice/testuser/` 自测（正例过、负例挡），并确认 `build-nodes.js` 节点数不变；测完删 testuser 和 `__pycache__`。
