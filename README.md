# PubMed Public Health Daily

> **科技感十足的自动化公共卫生文献聚合与可视化平台**

## 项目简介

本项目是一个面向公共卫生领域的自动化文献聚合与可视化网站。系统每日自动抓取 PubMed 上最新的"公共卫生"相关文章，支持历史归档、全文检索、科技感十足的可视化阅读体验。适合科研人员、医学生、公共卫生从业者和对前沿健康研究感兴趣的用户。

## 主要功能

- 🚀 **每日自动抓取**：定时从 PubMed 获取"公共卫生"相关最新文献，自动存档。
- 📚 **历史归档与检索**：支持按日期、关键词浏览和检索历史文章。
- 🧭 **科技感导航栏**：首页与详情页均有高亮、动效、锚点跳转的左侧导航。
- 🗂️ **美观分组归档**：历史摘要页面按年/月/日分组，卡片式展示，信息一目了然。
- 💎 **现代化 UI/UX**：深色渐变、毛玻璃、发光按钮、响应式布局，极具科技感。
- ⚡ **一键部署与自动化**：支持 GitHub Actions 自动抓取与推送，支持本地和云端部署。

## 自动化流程

- **数据抓取**：`fetch_pubmed_data.js` 每日自动运行，抓取并解析最新文献，生成 `_data/articles.json` 和 `_archives/YYYY-MM-DD.md`。
- **GitHub Actions**：`.github/workflows/fetch-data.yml` 定时触发抓取脚本，自动提交和推送数据更新。
- **Jekyll 构建**：基于 Jekyll 静态站点生成，支持本地和 GitHub Pages 部署。

## 目录结构说明

```
├── _archives/           # 每日文献归档（Markdown，自动生成）
├── _data/
│   └── articles.json    # 最新文章数据（自动生成）
├── _includes/           # 站点局部模板（导航栏、页头、页脚等）
├── _layouts/            # 页面布局模板（default, archive 等）
├── assets/
│   ├── css/             # 样式文件（主科技感样式 style.css）
│   └── js/              # 前端交互脚本
├── fetch_pubmed_data.js # PubMed 数据抓取与归档主脚本
├── index.html           # 首页入口
├── archives.md          # 历史摘要汇总页
├── README.md            # 项目说明文档
└── ...
```

## 本地运行方法

1. **克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd pubmed-public-health
   ```
2. **安装依赖**
   ```bash
   npm install
   bundle install
   ```
3. **抓取最新数据**
   ```bash
   node fetch_pubmed_data.js
   ```
4. **本地预览**
   ```bash
   bundle exec jekyll serve
   # 访问 http://localhost:4000/
   ```

## 自动化与部署

- **自动抓取**：已配置 GitHub Actions，每日自动抓取并推送数据。
- **静态部署**：可直接部署到 GitHub Pages、Vercel、Netlify 等平台。
- **自定义美化**：可修改 `assets/css/style.css` 和 `_includes/`、`_layouts/` 下模板，打造专属科技感风格。

## 美化与科技感设计

- 深色渐变背景、毛玻璃、发光按钮、卡片式分组，参考 [qzq.at](https://www.qzq.at/#home) 等现代科技网站风格。
- 响应式布局，移动端体验友好。
- 丰富的 icon、hover 动效、锚点跳转，提升交互体验。

## 致谢与参考

- [PubMed E-utilities API](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
- [Jekyll](https://jekyllrb.com/)
- [FontAwesome](https://fontawesome.com/)
- [qzq.at](https://www.qzq.at/#home)（科技感 UI 灵感来源）

---

> 本项目开源，欢迎 Star、Fork、PR 及建议！
