# DLHONTEK 产品展示网站

仪器仪表类工业产品（水质分析仪表、工业阀门、流量仪表、压力/液位/温度仪表）静态产品展示网站，中英双语，部署于阿里云 OSS + CDN。

技术栈：Astro 5（纯静态输出）· Tailwind CSS 4 · Pagefind（站内搜索）· @astrojs/sitemap

## 本地开发

```bash
nvm use            # Node 22（见 .nvmrc）
npm ci
npm run dev        # http://localhost:4321
npm run check      # 类型检查
npm run build      # 输出 dist/ 并生成搜索索引
npm run preview    # 预览构建结果（站内搜索仅在 build 后可用）
```

## 目录结构

```
src/
  content/products/*.yaml   产品数据（每个产品一个文件，中英字段）
  content.config.ts         产品数据字段定义（schema）
  data/categories.ts        产品分类
  data/site.ts              公司名称、电话、邮箱、备案号等全站信息
  i18n/index.ts             界面文案（中/英）
  views/                    页面模板（中英共用）
  pages/  pages/en/         路由：中文在根路径，英文在 /en/
  components/               页头、页脚、产品卡片、筛选、询价表单、悬浮客服
public/images/              图片（产品图放在 public/images/products/<slug>/）
scripts/import-docx.mjs     Word 产品资料导入脚本
```

## 产品维护

新增产品：在 `src/content/products/` 下新建 `<slug>.yaml`（可复制已有文件），文件名即 URL：
`/products/<category>/<slug>/`。`featured: true` 的产品展示在首页「常用产品」。

从 Word 导入（文字转成详情正文，图片提取到 `public/images/products/<slug>/`）：

```bash
npm run import:docx -- ./资料/DH-LDE电磁流量计.docx --category flow
npm run import:docx -- ./资料/阀门/ --category valves          # 整个目录
npm run import:docx -- ./en/DH-LDE.docx --category flow --lang en   # 英文版正文
```

导入后需人工补充英文名称、参数表（specs）、特点和标签。

### 在线后台（Pages CMS）

仓库根目录的 `.pages.yml` 定义了 [Pages CMS](https://pagescms.org) 的编辑表单（产品中英文字段、参数表、图片、样本 PDF）。

1. 打开 https://app.pagescms.org ，用 GitHub 账号登录，按提示给 `dlhontek` 仓库安装 Pages CMS GitHub App。
2. 选择仓库和 `main` 分支，左侧「产品」即可新增、编辑或删除产品；图片上传到 `public/images/products/`，PDF 上传到 `public/files/`。
3. 每次保存都会直接提交到 GitHub，`main` 上的提交会自动部署到 OSS（约 2 分钟）。
4. 不熟悉 GitHub 的同事可在 Pages CMS 的 Collaborators 里用邮箱邀请。

新建产品时「文件名」就是网址的一部分，请用英文小写加连字符（如 `electric-butterfly-valve`）。

## 可选功能（环境变量，见 .env.example）

| 变量 | 作用 |
|---|---|
| `PUBLIC_INQUIRY_ENDPOINT` | 询价表单提交地址（Formspree / Web3Forms / 阿里云函数计算）。为空时表单改为打开邮件客户端 |
| `PUBLIC_CHAT_SCRIPT` | 在线客服脚本地址（53KF、企业微信客服等） |
| `PUBLIC_BAIDU_TONGJI` | 百度统计站点 ID |

## 部署到阿里云 OSS

1. 创建 Bucket（标准存储、公共读），在「数据管理 → 静态页面」中设置默认首页 `index.html`、默认 404 页 `404.html`，并开启子目录首页。
2. 绑定已完成 ICP 备案的自定义域名，开启 CDN 与 HTTPS。
3. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：
   - Secrets：`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`（建议使用只授权该 Bucket 的 RAM 子账号）
   - Variables：`OSS_BUCKET`、`OSS_ENDPOINT`（如 `oss-cn-hangzhou.aliyuncs.com`），可选 `PUBLIC_*` 变量
4. 推送到 `main` 会自动构建并同步到 OSS（`.github/workflows/deploy-oss.yml`）。未配置 `OSS_BUCKET` 时部署任务会跳过。

发布前请修改 `astro.config.mjs` 中的 `site` 为正式域名，并替换 `src/data/site.ts` 中的公司信息、备案号和 `public/images/wechat-qr.svg` 微信二维码。
