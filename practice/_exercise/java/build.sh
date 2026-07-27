#!/usr/bin/env bash
# 构建脚本 — 把打包的 SDK（knotlink-sdk/，默认包）与 Main.java 一起编译到 out/
# KnotLink SDK 源码已随项目打包在 ./knotlink-sdk/，无需额外依赖。
set -e
mkdir -p out
javac -encoding UTF-8 -sourcepath knotlink-sdk -d out Main.java
echo "✅ 编译完成。运行：java -cp out Main"
