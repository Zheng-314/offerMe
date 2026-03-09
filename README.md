# AI产品经理模拟面试教练

一个AI驱动的产品经理模拟面试Web应用，帮助用户通过实战模拟提升面试能力。

## 功能特点

- 简历上传与解析（支持PDF格式）
- 结构化面试流程（自我介绍、简历提问、技术能力考察等）
- 个性化面试复盘报告
- 响应式设计，支持移动端

## 技术栈

### 前端
- React 19 + Vite 7
- TailwindCSS 4
- 响应式设计

### 后端
- FastAPI (Python)
- PyPDF2 (PDF解析)
- DeepSeek API (LLM调用)
- Uvicorn (ASGI服务器)

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

## 项目结构

```
├── src/              # 前端代码
│   ├── App.jsx       # 主应用组件
│   ├── index.css     # 全局样式
│   └── main.jsx      # 应用入口
├── backend/          # 后端代码
│   ├── app.py        # FastAPI应用
│   ├── .env          # 环境配置
│   └── start.bat     # Windows启动脚本
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

## 功能扩展

- 用户注册登录系统
- 历史面试记录查看
- 社区功能/面试经验分享
- 更多面试方向（B端、数据产品等）
- 语音输入支持

## 项目状态

✅ 前端页面实现完成
✅ 后端API实现完成
✅ 简历上传与解析功能
✅ 结构化面试流程
✅ 面试报告生成
✅ 响应式设计

## 如何使用

1. 启动后端服务器
2. 启动前端开发服务器
3. 访问前端页面，上传简历
4. 开始模拟面试
5. 面试结束后查看复盘报告

## 技术实现细节

### 前端
- 使用React Hooks管理状态
- TailwindCSS实现响应式设计
- 模拟面试流程的状态机控制

### 后端
- FastAPI处理HTTP请求
- PyPDF2解析PDF简历
- 模拟LLM调用（实际使用时需集成DeepSeek API）

### 面试流程
1. 自我介绍
2. 简历针对性提问
3. 技术能力考察
4. JD匹配提问（如果提供了JD）
5. 结束与反馈

### 报告生成
- 能力雷达图（文字描述）
- 三个具体亮点
- 三个待改进点
- 针对性学习建议
- 面试完整回顾