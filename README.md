# README
# Reading 100 static site for GitHub Pages

## 本地步骤
1. 将所有 PDF 放入 `library/` 目录。
2. 运行 PowerShell 脚本生成清单：

   `powershell -ExecutionPolicy Bypass -File tools/generate-library.ps1`

   会生成/更新 `library/library.json`。
3. 打开 `index.html` 预览（用任何静态服务器或直接浏览器）。

## GitHub Pages 部署
- 将整个目录推送到仓库 `reading100`（project pages）。
- 在仓库设置中启用 Pages，选择 `main` 分支（root）。
- 访问 `https://cayfidence.github.io/reading100/`。

## 使用说明
- 主页自动读取 `library/library.json`，以书本形式显示。
- 点击一本书打开阅读器。
- 阅读完成点 `Finish`，半透明窗口会出现，填写五个问题（who/wanted/but/so/then），点 `Complete` 存档。
- 存档保存在浏览器 `localStorage`，同一设备上主页该书会变红（完成）。
- 新增或删除 PDF 后，重新运行生成脚本即可。

## 可配置项（前端）
- 标记颜色与样式：`assets/css/styles.css` 中 `.book-card.completed`。
- 本地存储命名空间：`assets/js/storage.js` 中 `NS = 'reading100'`。
- 标题/布局：`index.html`、`reader.html`。
