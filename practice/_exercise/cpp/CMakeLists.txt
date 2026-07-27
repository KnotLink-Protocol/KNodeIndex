cmake_minimum_required(VERSION 3.10)
project(msgreminder CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# KnotLink SDK 头文件已随项目打包在 ./knotlink/
add_executable(msgreminder main.cpp)
target_include_directories(msgreminder PRIVATE knotlink)

# SDK 使用了 std::thread，需要链接线程库
find_package(Threads REQUIRED)
target_link_libraries(msgreminder PRIVATE Threads::Threads)
