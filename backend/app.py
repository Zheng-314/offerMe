from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import json
import httpx
import os

# 获取API配置 - 直接从环境变量读取（Render 会自动设置）
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
API_BASE_URL = os.getenv("API_BASE_URL", "https://api.deepseek.com/v1")

# 打印调试信息 - 显示所有环境变量
print("=" * 50)
print("Environment Variables Debug:")
print(f"All env vars: {dict(os.environ)}")
print(f"DEEPSEEK_API_KEY is set: {bool(DEEPSEEK_API_KEY)}")
print(f"DEEPSEEK_API_KEY value: {DEEPSEEK_API_KEY[:10]}..." if DEEPSEEK_API_KEY else "DEEPSEEK_API_KEY value: (empty)")
print(f"API_BASE_URL: {API_BASE_URL}")
print("=" * 50)

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 调用DeepSeek API
async def call_llm(prompt: str, max_tokens: int = 1000) -> str:
    """调用DeepSeek API"""
    if not DEEPSEEK_API_KEY:
        return "错误：未配置DEEPSEEK_API_KEY，请在backend/.env文件中配置"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{API_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "你是一位专业的产品经理面试官，善于挖掘候选人的产品思维、项目经验和专业能力。"
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "max_tokens": max_tokens,
                    "temperature": 0.7
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        return f"API调用失败: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"API调用异常: {str(e)}"

# 解析简历PDF
async def parse_resume(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        # 使用LLM解析简历为结构化数据
        if text.strip():
            parse_prompt = f"""请分析以下简历内容，提取关键信息并以JSON格式返回，包含以下字段：
{{
  "education": ["教育经历1", "教育经历2"],
  "experience": ["工作经历1", "工作经历2"],
  "projects": ["项目经历1", "项目经历2"],
  "skills": ["技能1", "技能2", "技能3"]
}}

简历内容：
{text[:4000]}  # 限制长度避免token过多

请只返回JSON，不要其他文字。"""

            llm_response = await call_llm(parse_prompt, max_tokens=800)

            # 尝试解析JSON
            try:
                # 清理可能的前后缀
                clean_response = llm_response.strip()
                if clean_response.startswith("```json"):
                    clean_response = clean_response[7:]
                if clean_response.endswith("```"):
                    clean_response = clean_response[:-3]
                clean_response = clean_response.strip()

                structured_data = json.loads(clean_response)
                structured_data["raw_text"] = text  # 保存原始文本
                return structured_data
            except json.JSONDecodeError:
                # 如果JSON解析失败，使用原始文本
                return {
                    "raw_text": text,
                    "education": ["解析失败，请检查简历格式"],
                    "experience": ["解析失败，请检查简历格式"],
                    "projects": ["解析失败，请检查简历格式"],
                    "skills": ["解析失败，请检查简历格式"]
                }
        else:
            return {
                "raw_text": "",
                "education": ["简历内容为空"],
                "experience": ["简历内容为空"],
                "projects": ["简历内容为空"],
                "skills": ["简历内容为空"]
            }
    except Exception as e:
        return {
            "error": str(e),
            "education": ["简历解析失败"],
            "experience": ["简历解析失败"],
            "projects": ["简历解析失败"],
            "skills": ["简历解析失败"]
        }

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), jd: str = Form(None)):
    try:
        # 解析简历
        resume_data = await parse_resume(file.file)

        # 调用LLM生成面试问题
        jd_info = f"\n目标岗位JD：{jd}" if jd else ""
        prompt = f"""我是一名产品经理面试官，准备面试一位候选人。

简历信息：
教育背景：{', '.join(resume_data.get('education', []))}
工作经历：{', '.join(resume_data.get('experience', []))}
项目经验：{', '.join(resume_data.get('projects', []))}
技能：{', '.join(resume_data.get('skills', []))}
{jd_info}

请生成3-5个针对性的面试问题，覆盖：
1. 项目经验深度挖掘
2. 产品思维考察
3. 问题解决能力
4. 团队协作能力

每个问题后面用【问题】标记。请只返回问题列表，不要其他内容。"""

        llm_response = await call_llm(prompt, max_tokens=800)

        return {
            "success": True,
            "resume_data": resume_data,
            "interview_questions": llm_response
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/get-interview-response")
async def get_interview_response(message: str = Form(...), stage: str = Form(...)):
    try:
        # 根据不同阶段生成不同的回复策略
        stage_prompts = {
            "自我介绍": """你正在面试一位产品经理候选人。候选人刚刚完成自我介绍。

请根据候选人的自我介绍，进行以下操作：
1. 给予积极的反馈
2. 提出1-2个针对性的追问问题，挖掘更多信息

如果自我介绍很完整，可以说："感谢你的介绍。接下来我想深入了解你的项目经验..."然后提问一个具体问题。

请保持专业、友好的语气。""",

            "简历针对性提问": """你正在面试一位产品经理候选人，正在进行简历针对性提问。

请根据候选人的回答，进行以下操作：
1. 评估回答质量
2. 如果回答不完整，继续追问
3. 如果回答很好，提出下一个相关的问题
4. 问题要具体，要求候选人举例说明

请保持专业、深入的面试风格。""",

            "技术能力考察": """你正在面试一位产品经理候选人，正在进行技术能力考察。

重点关注：
- 候选人对技术的理解深度
- 是否能与技术团队有效沟通
- 对新技术、AI技术的了解程度

请提出具体的技术相关问题，如：如何与开发团队协作、如何评估技术可行性、对AI技术的理解等。

请保持专业的面试风格。""",

            "结束与反馈": """你正在结束一场产品经理模拟面试。

请根据前面的对话，给出一个简洁的总结和反馈：
1. 感谢候选人的参与
2. 总结候选人的亮点
3. 给出1-2个改进建议
4. 表示面试结束

请保持友好、鼓励的语气。"""
        }

        system_prompt = stage_prompts.get(stage, stage_prompts["简历针对性提问"])

        # 调用LLM生成面试回复
        response = await call_llm(
            f"{system_prompt}\n\n候选人回答：{message}",
            max_tokens=600
        )

        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/generate-report")
async def generate_report(conversation: str = Form(...)):
    try:
        # 生成评估报告
        report_prompt = f"""你是一位资深的产品经理和面试专家，请根据以下面试对话，生成一份详细的面试复盘报告。

面试对话：
{conversation[:6000]}

请以JSON格式返回报告，包含以下字段：
{{
  "score": {{
    "需求分析": 1-10的整数分数,
    "产品思维": 1-10的整数分数,
    "技术理解": 1-10的整数分数,
    "沟通表达": 1-10的整数分数,
    "问题解决": 1-10的整数分数
  }},
  "highlights": [
    "亮点1",
    "亮点2",
    "亮点3"
  ],
  "improvements": [
    "待改进点1",
    "待改进点2",
    "待改进点3"
  ],
  "suggestions": [
    "学习建议1",
    "学习建议2",
    "学习建议3"
  ]
}}

请只返回JSON，不要其他文字。分数要真实反映面试表现。"""

        llm_response = await call_llm(report_prompt, max_tokens=1200)

        # 尝试解析JSON
        try:
            clean_response = llm_response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]
            clean_response = clean_response.strip()

            report = json.loads(clean_response)

            # 确保所有必需字段都存在
            if "score" not in report:
                report["score"] = {"需求分析": 7, "产品思维": 7, "技术理解": 7, "沟通表达": 7, "问题解决": 7}
            if "highlights" not in report:
                report["highlights"] = ["表现良好"]
            if "improvements" not in report:
                report["improvements"] = ["需要继续提升"]
            if "suggestions" not in report:
                report["suggestions"] = ["多加练习"]

            return {
                "success": True,
                "report": report
            }
        except json.JSONDecodeError:
            # 如果JSON解析失败，返回默认报告
            return {
                "success": True,
                "report": {
                    "score": {"需求分析": 7, "产品思维": 7, "技术理解": 7, "沟通表达": 7, "问题解决": 7},
                    "highlights": ["完成面试"],
                    "improvements": ["报告生成格式问题"],
                    "suggestions": ["建议重新生成"]
                }
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)