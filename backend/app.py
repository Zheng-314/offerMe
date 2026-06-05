from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import PyPDF2
import json
import httpx
import os
import random

# 加载环境变量
load_dotenv()

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
async def call_llm(messages: list, max_tokens: int = 1000, temperature: float = 0.7) -> str:
    """调用DeepSeek API，支持多轮对话"""
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
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature
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

            messages = [
                {"role": "system", "content": "你是简历解析专家，擅长从简历文本中提取结构化信息。"},
                {"role": "user", "content": parse_prompt}
            ]
            llm_response = await call_llm(messages, max_tokens=800)

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

        messages = [
            {"role": "system", "content": "你是产品经理面试官，擅长根据简历生成针对性面试问题。"},
            {"role": "user", "content": prompt}
        ]
        llm_response = await call_llm(messages, max_tokens=800)

        return {
            "success": True,
            "resume_data": resume_data,
            "interview_questions": llm_response
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/get-interview-response")
async def get_interview_response(
    message: str = Form(...),
    stage: str = Form(...),
    depth: int = Form(0),
    history: str = Form(""),
    resume_context: str = Form("")
):
    """追问地狱模式：AI面试官会根据回答深度层层追问"""
    try:
        # 解析对话历史
        conversation_history = []
        if history:
            try:
                conversation_history = json.loads(history)
            except:
                pass

        # 追问策略：不同深度对应不同追问风格
        followup_strategies = {
            0: "挖掘背景层",      # 第一次提问
            1: "细节追问层",      # 追问细节
            2: "挑战假设层",      # 质疑候选人的假设
            3: "压力测试层",      # 压力场景
            4: "认知边界层"       # 触及能力边界
        }

        strategy = followup_strategies.get(depth, "认知边界层")

        # 判断是否应该继续追问
        should_continue = depth < 4  # 最多追问4层

        # 构建系统提示词
        system_prompt = f"""你是一位顶级产品经理面试官，风格严厉但专业。你正在面试一位产品经理候选人。

当前阶段：{stage}
当前追问深度：{depth}层（{strategy}）
简历信息：{resume_context}

## 你的追问策略（严格按照当前深度执行）

### 深度0（挖掘背景层）：
- 问"为什么做这个决定？"
- 问"当时的核心目标和背景是什么？"
- 要求候选人解释项目/经历的上下文

### 深度1（细节追问层）：
- 问"你具体是怎么做的？用了什么方法？"
- 追问执行层面的细节
- 要求候选人提供具体数据、指标、样本量

### 深度2（挑战假设层）：
- 质疑候选人的判断："你有没有考虑过另一种可能？"
- 问"你的假设是什么？怎么验证的？"
- 要求候选人解释为什么排除其他方案

### 深度3（压力测试层）：
- 制造压力场景："如果预算砍半/时间缩短/老板不同意，你怎么办？"
- 问"你刚才说的和前面提到的XX似乎矛盾，怎么解释？"
- 要求候选人在压力下做取舍决策

### 深度4（认知边界层）：
- 问到候选人明显答不上来的领域
- 探索候选人知识体系的盲区
- 用"如果重来一次，你会怎么做不同？"作为收尾

## 规则：
1. 每次只问1-2个问题，不要一次问太多
2. 如果候选人回答敷衍或回避，追问得更狠
3. 如果候选人回答很好，可以适当认可后再追问
4. 语气专业但犀利，不废话
5. 不要重复之前问过的问题"""

        # 构建消息列表
        messages = [{"role": "system", "content": system_prompt}]
        for msg in conversation_history[-10:]:  # 最近10轮对话
            messages.append(msg)
        messages.append({"role": "user", "content": message})

        response = await call_llm(messages, max_tokens=600)

        return {
            "success": True,
            "response": response,
            "depth": depth + 1,  # 返回新的追问深度
            "strategy": strategy
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/generate-report")
async def generate_report(conversation: str = Form(...)):
    """生成逐句点评报告"""
    try:
        # 生成评估报告 - 逐句点评模式
        report_prompt = f"""你是一位资深的产品经理面试专家，请根据以下面试对话，生成一份**逐句点评**的复盘报告。

面试对话（JSON格式）：
{conversation[:8000]}

请以JSON格式返回报告，包含以下字段：

```json
{{
  "score": {{
    "需求分析": 1-10分,
    "产品思维": 1-10分,
    "技术理解": 1-10分,
    "沟通表达": 1-10分,
    "问题解决": 1-10分
  }},
  "overall_summary": "一句话总评",
  "rounds": [
    {{
      "question": "面试官的问题（简要）",
      "answer": "候选人的回答（简要）",
      "verdict": "good|ok|bad",
      "comment": "点评：这句话好在哪/扣分在哪（2-3句话）",
      "improved_answer": "如果重来一次，建议这样回答：（给出一个更好的回答示范，保持候选人的真实经历，但优化表达方式）"
    }}
  ],
  "highlights": [
    "亮点1（具体指出是哪一轮的哪个回答）",
    "亮点2",
    "亮点3"
  ],
  "improvements": [
    "待改进点1（具体指出是哪一轮的哪个问题）",
    "待改进点2",
    "待改进点3"
  ],
  "suggestions": [
    "学习建议1（针对薄弱项的具体行动建议）",
    "学习建议2",
    "学习建议3"
  ]
}}
```

## 逐句点评规则：
1. **verdict判断**：
   - "good"：回答结构清晰、有数据支撑、展示了深度思考
   - "ok"：回答基本合格但缺乏亮点，可以更深入
   - "bad"：回答敷衍、回避问题、逻辑混乱、缺乏具体例子

2. **comment要求**：
   - 指出具体好在哪/差在哪（如"用了STAR结构，逻辑清晰"或"缺少量化数据"）
   - 不要泛泛而谈，要针对具体内容

3. **improved_answer要求**：
   - 保持候选人的真实经历和项目
   - 优化表达方式：加入数据、用STAR结构、展示深度思考
   - 不要编造候选人没做过的事

4. **highlights和improvements**：
   - 必须引用具体的轮次（如"第2轮关于用户调研的回答"）

请只返回JSON，不要其他文字。"""

        messages = [
            {"role": "system", "content": "你是产品经理面试复盘专家，擅长逐句分析面试表现。"},
            {"role": "user", "content": report_prompt}
        ]
        llm_response = await call_llm(messages, max_tokens=3000, temperature=0.5)

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
            if "overall_summary" not in report:
                report["overall_summary"] = "面试表现中规中矩，有提升空间"
            if "rounds" not in report:
                report["rounds"] = []
            if "highlights" not in report:
                report["highlights"] = ["完成面试"]
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
                    "overall_summary": "面试完成，报告生成格式异常",
                    "rounds": [],
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