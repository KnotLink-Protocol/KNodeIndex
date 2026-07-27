# 🎓 KnotLink 新手训练营

**用「完形填空」的方式，走一遍 KnotLink 接入全流程。**

这里不是真节点仓库，而是一块**练习场**。你不需要有自己的应用、也不需要想创意——只要把一个现成的「消息提醒」节点模板里的空白（`___FILL_THIS___`）填完，就能亲手体验：**写通信代码 → 填功能清单 → 填身份清单 → 自检 → 提 PR** 的完整流程。

> **麻雀虽小，五脏俱全**：这个练习节点同时演示 KnotLink 的两种通信模式——
> **接口（Responser）**：被别的节点调用时，打印消息并回复 `OK`；
> **信号（Sender）**：打印后广播一个 `messageShown` 信号。
>
> ⚠️ 这是**练习**，不是真节点。所有练习产物都留在 `practice/` 目录，**不会**出现在官网节点墙、也不会被 KnotHub 加载。真实节点请走 [`CONTRIBUTING.md`](../CONTRIBUTING.md) 的正式流程。

---

## 你需要准备

- **Node.js**（用来跑自检脚本 `validate-practice.js`）
- 你选那门语言的运行环境（Python 3.8+ / Node.js / JDK / .NET 8 / g++ + CMake 之一）

> **SDK 已经打包在每个语言项目里**（`knotlink/`），拷出来就能编译运行，**无需再装 SDK**。

| 语言 | 项目文件夹 | 入口 | 构建 / 运行 |
|------|-----------|------|------------|
| Python | `python/` | `main.py` | `python main.py` |
| JavaScript | `javascript/` | `main.js` | `node main.js` |
| Java | `java/` | `Main.java` | `bash build.sh` → `java -cp out Main` |
| C# | `csharp/` | `Program.cs` | `dotnet run` |
| C++ | `cpp/` | `main.cpp` | `cmake -B build && cmake --build build` |

---

## 六步流程

```
选一个语言项目 → ① 选一个 AppID → ② 写代码 → ③ 填 FuncList → ④ 填 manifest → ⑤ 自检 → ⑥ 提 PR
```

### 第 0 步：挑一个语言项目

进 `_exercise/`，里面每种语言是一个**自带 SDK、能直接编译运行的完整项目**。挑你会的那一种，把**整个文件夹**复制成 `practice/<你的GitHub用户名>/`：

```bash
cp -r _exercise/python practice/你的用户名     # 或 javascript / java / csharp / cpp
```

一个语言项目长这样（以 Python 为例）：

```
practice/你的用户名/
├── main.py                # 通信代码（要填）
├── plugin_manifest.json   # 身份清单（要填）
├── FuncList.json          # 功能清单：接口 + 信号（要填）
├── README.md              # 项目说明（要填）
├── logo.png               # 占位图，不用改
├── requirements.txt       # 依赖说明
└── knotlink/              # 打包好的 SDK，不用改
```

### 第 1 步：选一个 AppID

在你选的代码文件里，`APPID` 用**倒置域名**、把你的名字嵌进去：`com.github.<你的用户名>.msgreminder`。这样 AppID 天然唯一，也是你的署名。

> KnotLink 也兼容旧的 `0x`+8 位十六进制格式，但新项目推荐倒置域名。练习里用你自己的用户名即可，无需额外申请。

### 第 2 步：读懂通信代码（已完整给出 + 逐块讲解）

项目里的入口文件（`main.py` / `main.js` / …）里的代码**已经按节点的执行逻辑分成 5 块、完整写好并带注释**。你不用填空、也不用拼装，只要**读懂每块在干什么**，然后把 ① 里的 `APPID` 换成你自己（`com.github.<你的用户名>.msgreminder`）。

一个「被调用就打印消息、并广播已显示信号」的节点，逻辑就是这条线：

| 块 | 干什么 | 关键代码（Python 示意） |
|----|--------|------------------------|
| ① 上线 | 声明身份（AppID + 接口 + 信号），当「回复者」连上 KnotLink | `OpenSocketResponser(APPID, OPENSOCKET_ID)` |
| ② 解析 | 被调用时，用 **KLUDF** 把 `key=value` 请求解析出参数 | `req.deserialize(data)` → `req.get("msgContext")` |
| ③ 处理 | 你的业务：把消息打印出来 | `print(message)` |
| ④ 报告 | 用 **KLUDF** 打包 `content` + `time`，广播信号 | `out.serialize()` → `sender.emitt(...)` |
| ⑤ 回复 | 告诉调用方成功 | `return "OK"` |

> 数据进出都走 **KLUDF**（`KLKVMap`）标准化：`deserialize` 解析、`get` 取参数、`serialize` 打包。5 种语言逻辑完全一样、只是语法不同——照着你项目里的 ①~⑤ 注释读一遍就懂。SDK 已打包在 `knotlink/`（JS/Java 的 `KLKVMap` 是训练营补充），改完 AppID 就能编译运行。

### 第 3 步：填 `FuncList.json`

告诉工具链你的节点有哪些接口和信号。要填 `appName`、接口/信号的 `appID`、`openSocketID`、`signalID`、`description`。

- **`appID` 必须和代码、manifest 里的一致。**
- 注意 `signal.messageShown.returns` 是**对象格式** `{ "字段名": { "description": "..." } }`，不是数组——这是常见坑。

### 第 4 步：填 `plugin_manifest.json`

节点身份：`app_id`（同上）、`plugin_name`、`author`、`description`、`exe_path`。

> 真实节点这一步要把代码打包成 exe，`exe_path` 写 exe 文件名。**练习跳过打包**，`exe_path` 随便填个合理的名字（如 `MsgNotification.exe`）体会这个字段即可。

### 第 5 步：本地自检

在仓库根目录跑：

```bash
node validate-practice.js
```

它会逐条告诉你：有没有空没填、ID 是否跨文件一致、格式对不对。**全绿再提 PR。**

### 第 6 步：提 PR

Fork → 提交你的 `practice/<用户名>/` → 发 PR。CI 会自动重跑校验（红叉/绿勾）。维护者合并后，你的练习就留档在 `practice/` 里——你已经完整走通了一次 KnotLink 接入。🎉

---

## 一致性速查（校验器会检查）

| 值 | 出现在哪 | 规则 |
|----|---------|------|
| AppID | 代码 `APPID`、`manifest.app_id`、`FuncList` 接口 `appID`、信号 `appID` | 四处**完全相同**，倒置域名如 `com.github.你的用户名.msgreminder` |
| 接口 ID | 代码 `OPENSOCKET_ID`、`FuncList.openSocket.ShowMsg.openSocketID` | 一致，描述性名称如 `show` |
| 信号 ID | 代码 `SIGNAL_ID`、`FuncList.signal.messageShown.signalID` | 一致，描述性名称如 `messageShown` |
| 名称 | `manifest.plugin_name`、`FuncList.appName` | 一致 |

## 想看填好的样子？

- **参考答案**：[`_answer/`](_answer/) —— 每种语言一个文件夹，`main.*` + 元数据全填好了。**建议先自己填、卡住了再来对照**；直接抄能过校验，但你就没「亲手走一遍」。（答案是精简版：只有填好的代码和元数据，不含打包 SDK；要跑就用 `_exercise` 对应项目的 `knotlink/`。）
- 真实节点：[`plugin/MsgNotification-HXH/`](../plugin/MsgNotification-HXH/)（真实节点只有接口、没有信号，也不含源码——练习为教学多加了信号，并把 SDK/源码打包进项目方便上手）。
