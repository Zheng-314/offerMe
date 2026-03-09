import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE_URL = 'https://offerme-sldu.onrender.com';

// 添加调试信息
console.log('API_BASE_URL:', API_BASE_URL);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [savedResumes] = useState([]);
  const [savedReports, setSavedReports] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSaveReport = (reportData) => {
    setSavedReports(prev => [...prev, reportData]);
  };

  const handleStartInterview = (resumeFile, jdText) => {
    setCurrentPage('interview');
    return { resumeFile, jdText };
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {currentPage === 'home' && (
        <HomePage
          onStartInterview={handleStartInterview}
          onPageChange={handlePageChange}
          savedResumes={savedResumes}
        />
      )}
      {currentPage === 'interview' && (
        <InterviewPage
          onPageChange={handlePageChange}
          onSaveReport={handleSaveReport}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage
          onPageChange={handlePageChange}
          savedResumes={savedResumes}
          savedReports={savedReports}
        />
      )}
    </div>
  );
}

// 首页 - 上传简历
function HomePage({ onStartInterview, onPageChange, savedResumes }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartInterview = () => {
    if (!resumeFile) return;
    onStartInterview(resumeFile, jdText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">面霸</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPageChange('profile')}
              className="text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="font-medium">我的</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero区域 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            AI 面试教练
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            提高简历竞争度，学习面试技巧
          </p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
          {/* 简历上传区域 */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center mb-8 transition-all duration-300 group ${
              resumeFile
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="resume-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center">
              {resumeFile ? (
                <>
                  <div className="w-16 h-16 mb-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/>
                    </svg>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg mb-2">{resumeFile.name}</p>
                  <p className="text-sm text-gray-500">点击更换文件</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">拖拽上传或点击选择</p>
                  <p className="text-sm text-gray-400">支持 PDF 格式</p>
                </>
              )}
            </label>
          </div>

          {/* JD输入区域 */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium text-sm mb-3">岗位描述（可选）</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 h-32 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none"
              placeholder="粘贴 JD 可获得更精准的面试提问..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          {/* 开始面试按钮 */}
          <button
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              resumeFile
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleStartInterview}
            disabled={!resumeFile}
          >
            开始面试
          </button>
        </div>

        {/* 已保存的简历 */}
        {savedResumes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">最近使用的简历</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedResumes.map((resume, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{resume.name}</p>
                      <p className="text-sm text-gray-400">{resume.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 面试页面
function InterviewPage({ onPageChange, onSaveReport }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '你好，欢迎参加这次模拟面试。请先用1-2分钟做一个简单的自我介绍，重点突出你的产品经理相关经历和优势。',
      stage: '自我介绍'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState('自我介绍');
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);

  const [stageCount, setStageCount] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/get-interview-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          message: inputValue,
          stage: currentStage
        })
      });

      const data = await response.json();

      if (data.success) {
        let aiResponse = {
          role: 'assistant',
          content: data.response,
          stage: currentStage
        };

        let nextStage = currentStage;
        let nextStageCount = stageCount;

        if (currentStage === '自我介绍') {
          nextStage = '简历针对性提问';
          nextStageCount = 2;
        } else if (currentStage === '简历针对性提问' && stageCount >= 2) {
          nextStage = '技术能力考察';
          nextStageCount = 3;
        } else if (currentStage === '技术能力考察') {
          nextStage = '结束与反馈';
          nextStageCount = 5;
          setTimeout(async () => {
            const conversation = JSON.stringify([...messages, newMessage, aiResponse]);
            const reportResponse = await fetch(`${API_BASE_URL}/api/generate-report`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                conversation: conversation
              })
            });

            const reportData = await reportResponse.json();
            if (reportData.success) {
              setReport(reportData.report);
              setShowReport(true);
              onSaveReport({
                ...reportData.report,
                date: new Date().toLocaleDateString()
              });
            }
          }, 1000);
        }

        setMessages(prev => [...prev, aiResponse]);
        setCurrentStage(nextStage);
        setStageCount(nextStageCount);
        setIsTyping(false);
      } else {
        setIsTyping(false);
        alert('获取回复失败：' + data.error);
      }
    } catch (error) {
      setIsTyping(false);
      alert('获取回复失败：' + error.message);
    }
  };

  const handleBack = () => {
    onPageChange('home');
  };

  if (showReport) {
    return <ReportPage report={report} onRestart={handleBack} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 头部 */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
              </svg>
            </div>
            <span className="text-gray-900 font-semibold text-lg">AI 面试官</span>
          </div>
          <span className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-full border border-blue-200/50">{currentStage}</span>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[70%] p-5 rounded-2xl ${
                  message.role === 'assistant'
                    ? 'bg-white border border-gray-200/50 text-gray-800 shadow-lg shadow-gray-200/50'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
                </svg>
              </div>
              <div className="bg-white border border-gray-200/50 p-5 rounded-2xl shadow-lg shadow-gray-200/50">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex gap-4">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-gray-100 border border-gray-200/50 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
            placeholder="输入你的回答..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// 报告页面
function ReportPage({ report, onRestart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">面霸</span>
          </div>
          <button
            onClick={onRestart}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            返回首页
          </button>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">面试复盘报告</h1>
          <p className="text-gray-500">基于 AI 分析的综合评估</p>
        </div>

        <div className="space-y-6">
          {/* 能力评分 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              能力评分
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {Object.entries(report.score || {}).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{value}</div>
                  <div className="text-sm text-gray-600 font-medium">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 亮点 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              亮点
            </h2>
            <ul className="space-y-4">
              {(report.highlights || []).map((item, index) => (
                <li key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl hover:from-green-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 待改进点 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              待改进点
            </h2>
            <ul className="space-y-4">
              {(report.improvements || []).map((item, index) => (
                <li key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-xl hover:from-yellow-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 学习建议 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
            <h2 className="text-gray-900 font-semibold text-xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              学习建议
            </h2>
            <ul className="space-y-4">
              {(report.suggestions || []).map((item, index) => (
                <li key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 我的页面
function ProfilePage({ onPageChange, savedResumes, savedReports }) {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleBackToProfile = () => {
    setSelectedReport(null);
  };

  if (selectedReport) {
    return <ReportPage report={selectedReport} onRestart={handleBackToProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">面霸</span>
          </div>
          <button
            onClick={() => onPageChange('home')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            返回首页
          </button>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* 用户信息 */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl shadow-gray-200/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">我的</h1>
              <p className="text-gray-500">管理你的简历和面试记录</p>
            </div>
          </div>
        </div>

        {/* 简历管理 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            我的简历
          </h2>
          {savedResumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedResumes.map((resume, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-lg mb-1">{resume.name}</p>
                      <p className="text-sm text-gray-400">{resume.date}</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                      使用
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-gray-200/50 text-center hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-xl text-gray-600 mb-6 font-medium">还没有保存的简历</p>
              <button
                onClick={() => onPageChange('home')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                上传简历
              </button>
            </div>
          )}
        </div>

        {/* 面试报告 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            面试报告
          </h2>
          {savedReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedReports.map((report, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-lg mb-1">面试报告</p>
                      <p className="text-sm text-gray-400">{report.date}</p>
                    </div>
                    <button
                      onClick={() => handleViewReport(report)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-gray-200/50 text-center hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-xl text-gray-600 mb-6 font-medium">还没有面试报告</p>
              <button
                onClick={() => onPageChange('home')}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-medium shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                开始面试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
