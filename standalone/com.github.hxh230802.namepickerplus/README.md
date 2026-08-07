# NamePickerPlus

> 一款简洁的课堂点名软件，支持随机抽选、名单管理、悬浮球快捷操作

## 简介

NamePickerPlus 是 NamePicker 的续作，基于 PyQt5 + KnotLink 协议构建。支持从 CSV 名单中随机抽选学生，按性别/学号筛选，单次或多人抽选。通过 KnotLink 协议可与其他应用联动（语音播报、弹窗提醒、课表集成等）。

## 接口列表

| 接口 | 说明 |
|------|------|
| pick-single | 触发单次点名，返回姓名/学号/性别 |
| pick-multiple | 触发多次点名 |
| get-names | 获取当前名单 |
| add-name | 添加学生 |
| del-name | 删除学生 |
| update-name | 更新学生信息 |
| show-main-window | 显示主窗口 |
| hide-main-window | 隐藏主窗口 |
| show-floatball | 显示悬浮球 |
| hide-floatball | 隐藏悬浮球 |

## 信号列表

| 信号 | 说明 |
|------|------|
| onPickSingle | 单次点名完成，附带学生信息 |
| onPickMultiple | 多人点名完成，附带学生列表 JSON |

## 链接

- 官网文档：https://namepicker-docs.netlify.app/
- GitHub：https://github.com/hxh230802/NamePickerPlus
- KnotLink 节点：https://knotlink.cn/nodes
