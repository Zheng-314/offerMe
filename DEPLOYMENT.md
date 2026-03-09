# OfferMe - AI面试教练

一个基于 AI 的智能面试教练应用，帮助求职者提升面试技巧。

## 技术栈

- **前端**: React + Vite + Tailwind CSS
- **后端**: FastAPI (Python)
- **AI**: DeepSeek API

## 部署

### 前端部署到 Vercel

1. 访问 [Vercel](https://vercel.com) 并登录
2. 点击 "New Project"
3. 导入此 GitHub 仓库
4. 配置环境变量（可选）：
   - `VITE_API_BASE_URL`: 后端 API 地址

5. 点击 "Deploy"

### 后端部署到 Render

1. 访问 [Render](https://render.com) 并注册
2. 点击 "New +" -> "Web Service"
3. 连接你的 GitHub 仓库
4. 配置：
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

5. 添加环境变量：
   - `DEEPSEEK_API_KEY`: 你的 DeepSeek API Key
   - `API_BASE_URL`: `https://api.deepseek.com/v1`

6. 点击 "Create Web Service"

部署完成后，将 Render 提供的后端 URL 更新到 Vercel 的环境变量中。
