# 面霸 AI - 你的专属AI面试教练

> 让AI面试官比真人还狠，但每次被虐完你都变强一点点。

## 🎯 项目简介

**面霸 AI** 是一款AI驱动的产品经理模拟面试教练，核心特色是「追问地狱」模式——AI面试官会像顶级公司的真实面试官一样，对你的回答层层追问、步步紧逼，直到触及你的能力边界。面试结束后，你会获得一份逐句点评报告，精确到每一句话好在哪、扣分在哪、应该如何改进。

## ✨ 核心功能

### 🔥 追问地狱模式
- **5层追问策略**：挖掘背景 → 细节追问 → 挑战假设 → 压力测试 → 认知边界
- AI面试官不会轻易放过你，每轮回答都会被深入追问
- 模拟真实PM面试的高压环境，让你提前适应"被问到答不上来"的感觉

### 📝 逐句点评报告
- 每轮问答都有精确点评：✅优秀 / ⚠️合格 / ❌待改进
- 指出具体好在哪、扣分在哪（如"用了STAR结构，逻辑清晰"或"缺少量化数据"）
- 提供改写示范：如果重来一次，建议怎么答

### 📊 能力评估
- 5个维度评分：需求分析、产品思维、技术理解、沟通表达、问题解决
- 针对性学习建议和改进方向

### 📄 简历解析
- 支持PDF简历上传
- AI自动提取教育背景、工作经历、项目经验、技能
- 可选粘贴JD，获得更精准的面试提问

## 🏗️ 技术栈

### 前端
- React 19 + Vite 7
- TailwindCSS 4
- 响应式设计，支持移动端

### 后端
- FastAPI (Python)
- PyPDF2 (PDF解析)
- DeepSeek API (LLM调用)
- Uvicorn (ASGI服务器)

### AI能力
- 多轮对话管理（追问深度追踪）
- 结构化报告生成（逐句点评）
- 上下文感知的追问策略

## 快速开始

### 一键启动（推荐）

Windows 用户可以直接运行根目录的启动脚本：

```bash
start.bat
```

这会自动启动后端和前端服务器。

### 分别启动

#### 前端启动

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

前端将在 http://localhost:5173 运行

#### 后端启动

Windows 用户：
```bash
cd backend
start.bat
```

或者手动启动：

1. 进入backend目录
```bash
cd backend
```

2. 创建并激活虚拟环境
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 启动FastAPI服务器
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

后端将在 http://localhost:8000 运行

## 📁 项目结构

```
├── src/              # 前端代码
│   ├── App.jsx       # 主应用组件（含追问逻辑）
│   ├── index.css     # 全局样式
│   └── main.jsx      # 应用入口
├── backend/          # 后端代码
│   ├── app.py        # FastAPI应用（核心：追问地狱+逐句点评）
│   ├── .env          # 环境配置
│   └── requirements.txt
├── public/           # 静态资源
└── package.json      # 前端依赖
```

## 环境配置

在backend/.env文件中配置DeepSeek API密钥：

```
DEEPSEEK_API_KEY=sk-0fa0e84d417740d5b47963573ad51dfb
API_BASE_URL=https://api.deepseek.com/v1
```

## 部署

### 前端部署
- Vercel (推荐)
- Netlify
- GitHub Pages

### 后端部署
- Railway
- Render
- Heroku

## 注意事项

- 确保后端服务器在前端之前启动
- 生产环境中需要配置CORS为具体的域名
- 实际使用时需要替换为真实的DeepSeek API密钥

## 🚀 未来规划

- 用户注册登录系统
- 历史面试记录查看
- 成长档案（能力维度时间线图）
- 社区功能/面试经验分享
- 更多面试方向（B端、数据产品、技术产品等）
- 语音输入支持（Web Speech API）
- 多模态反馈（视频面试模拟）

## ✅ 项目状态

- ✅ 前端页面实现完成
- ✅ 后端API实现完成
- ✅ 简历上传与解析功能
- ✅ **追问地狱模式**（5层追问策略）
- ✅ **逐句点评报告**（每轮问答精确点评）
- ✅ 面试报告生成
- ✅ 响应式设计

## 📖 使用流程

1. 上传简历（PDF格式）
2. 可选粘贴目标岗位JD
3. 开始模拟面试
4. 被AI面试官层层追问
5. 面试结束后查看逐句点评报告
6. 根据报告改进，再次练习

---

**Made with ❤️ by 阿轩**