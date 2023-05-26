#!/bin/bash
# 当执行 `npm run build` 时将自动运行此脚本

IFS=$'\n'
# 使用 ANSI 转义序列设置红色
RED=$(tput setaf 3)
# 重置颜色
RESET=$(tput sgr0)
read -r -p "${RED}您是否要提交到 Git 版本控制器? (y/N):${RESET}" response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]; then             # 如果用户输入 'y' 或 'Y'，则执行操作
  read -r -p "请输入带有 '\\n' 换行符的多行提交消息：" input_text   # 提示用户输入带有换行符的文本(Example:`更新内容:\n1、测试内容\n2、测试内容\n3、测试内容`)
  commit_message="${input_text//\\n/$'\n'}"                   # 将字符串替换为实际换行符
  temp_file=$(mktemp)                                         # 创建一个临时文件来存储提交消息
  echo "$commit_message" > "$temp_file"                       # 将多行提交消息写入临时文件
  echo -e "\e[36m将修改的文件添加到Git暂存区...\e[0m"
  git add .                                                   # 将修改的文件添加到Git暂存区
  echo -e "\e[36m将暂存区内容添加到本地仓库中...\e[0m"
  git commit -F "$temp_file"                                  # 使用 -F 选项提交多行注释
  rm -f "$temp_file"                                          # 删除临时文件
  echo -e "\e[36m将本地仓库的修改推送到\`main\`远程分支...\e[0m"
  git push -u origin main                                     # 推送到 Beta 分支
else
  echo -e "\e[31m未进行代码提交\e[0m"
fi

echo -e "\e[32m脚本完成\e[0m"
