# PubMed 公共卫生文献雷达

这是 Lopo Blog 的文献发现与候选选题工具。它使用 PubMed E-utilities API，围绕生物统计、临床研究、流行病学、真实世界证据和可复现研究抓取最近文献，并生成静态站点。

## 目标

该项目不再以“抓取更多摘要”为目标，而是建立：

```text
PubMed 检索
→ 主题筛选与去重
→ 候选选题队列
→ 人工阅读全文与证据评价
→ 学习笔记或博客文章
```

自动结果只用于信息发现，不替代系统检索、全文阅读、风险偏倚评价或正式医学结论。

## 输出

- `_data/articles.json`：最近文献及命中主题；
- `_data/content_candidates.json`：最多 12 条候选选题、状态、入选原因和可转化方向；
- `_archives/YYYY-MM-DD.md`：每日可回溯归档；
- Jekyll 静态站点：与 Lopo Blog 对齐的轻量品牌界面。

## 本地运行

```bash
npm ci
node fetch_pubmed_data.js
bundle install
bundle exec jekyll serve
```

## 发布

Pull Request 只执行抓取、构建、验证并上传私有预览产物；合并到 `main` 或定时任务才会提交归档并部署到 `gcp-lopo/pubmed-public-health-pages`。

Token 和 PubMed API Key 只存放于 GitHub Actions Secrets。公开产物不得包含任何真实临床项目或个人敏感信息。
