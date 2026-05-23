import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

import axiosClient from "../../api/axiosClient";

const skillKeywordsMapping = {
  "Frontend Engineer": [
    "React Hooks (Side Effects)", "CSS Grid Layout", "Asynchronous JavaScript", "Virtual DOM Architecture",
    "Component Optimization", "Browser Storage API", "Semantic HTML & Accessibility", "CORS Security Policy",
    "CSS Responsive Units", "Global State Management"
  ],
  "Backend Engineer": [
    "RESTful API Architecture", "SQL Joins & Relations", "Password Hashing & Security", "Database Indexing Strategy",
    "JWT Authentication Structure", "Redis RAM Caching", "Middleware Pipeline Processing", "Docker Containerization",
    "Database ACID Transactions", "Microservices Architecture"
  ],
  "Fullstack Engineer": [
    "Next.js Hydration Model", "Cross-Site Scripting (XSS)", "NoSQL Document Databases", "GraphQL Query Data-fetching",
    "CSRF Security Vulnerability", "WebSockets Real-time Comm", "Database Connection Pooling", "ORM Framework Integration",
    "CDN Static Latency Optimization", "MVC Architectural Design"
  ],
  "Data AI / ML": [
    "Supervised Classification", "Machine Learning Overfitting", "Deep Learning Activation Functions", "Pandas Dataframe Manipulation",
    "Statistical Standard Deviation", "Unsupervised K-Means Clustering", "Confusion Matrix Diagnostics", "Dimensionality Reduction (PCA)",
    "Backpropagation Optimization", "Computer Vision Data Augmentation"
  ],
  "Mobile App Dev": [
    "Stateful Hot Reload", "Cross-Platform Native Bridge", "Android Activity Lifecycle", "iOS Automatic Reference Counting",
    "Firebase Cloud Messaging", "Main Thread Blocked (ANR)", "Offline-First Local DB", "Flutter ListView.builder",
    "App Store Deployment Requirements", "Mobile Deep Linking Flow"
  ],
  "DevOps Engineer": [
    "Continuous Integration Pipelines", "Infrastructure as Code (IaC)", "Kubernetes Pod Deployment", "Prometheus & Grafana Monitoring",
    "GitFlow Branching Strategy", "Centralized ELK Logging Stack", "Blue-Green Zero-Downtime", "Nginx Load Balancing Proxy",
    "SAST Vulnerability Scanning", "Ansible Configuration Idempotency"
  ],
  "Cyber Security": [
    "SQL Injection Mitigation", "Social Engineering (Phishing)", "Symmetric AES Encryption", "DDoS Botnet Attack Profiles",
    "IDOR API Authorization Broken", "SSL/TLS Traffic Encryption", "Layer 7 WAF Deployment", "Zero Trust Architecture",
    "Penetration Testing Simulation", "Password Salting Security"
  ],
  "UI/UX Designer": [
    "Visual Hierarchy Order", "Wireframing Structural Layout", "RGB Digital Display Gamut", "Micro-interaction UI Animation",
    "Fitts's Law UX Target", "UI Aesthetics vs UX Flow", "Design System Scalability", "Negative Space Composition",
    "A/B Testing Conversion Optimization", "WCAG Contrast Accessibility"
  ],
  "default": [
    "LIFO Stack Structures", "Git Version Control", "HTTP Communication Methods", "HTTP REST Status Codes",
    "OOP Inheritance Principles", "JSON Data Interchange Format", "Ping Network Latency Diagnostics", "Linux Server Cloud OS",
    "CI/CD Core Integration pipelines", "SSL/TLS Protocol Foundations"
  ]
};

export default function Assessment() {
  const navigate = useNavigate();
  
  const [role, setRole] = useState("IT Engineer");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);

  // Mảng lưu vết kết quả trả lời (Đúng/Sai) của từng câu hỏi để phân tích Kỹ năng
  const [answersTracker, setAnswersTracker] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true);
    }, 50);

    const savedData = JSON.parse(localStorage.getItem("devpath_analysis_result"));
    const selectedRole = savedData?.role || "default";
    setRole(selectedRole);

    const fetchQuestions = async () => {
      try {
        const response = await axiosClient.get(`/assessments/role/${selectedRole}`);
        if (response && response.questions) {
          const formattedQuestions = response.questions.map(q => {
            const correctIndex = q.options.findIndex(opt => opt.is_correct);
            return {
              question: q.content,
              options: q.options.map(opt => opt.option_text),
              answerIndex: correctIndex !== -1 ? correctIndex : 0
            };
          });
          setQuestions(formattedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch assessment from DB:", err);
        setQuestions([]);
      }
    };

    fetchQuestions();

    return () => clearTimeout(animationTimeout);
  }, []);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQIndex];
    const isCorrect = selectedOption === currentQuestion?.answerIndex;
    
    // Lưu thông tin đúng/sai kèm theo nội dung câu hỏi
    const updatedTracker = [
      ...answersTracker,
      {
        questionText: currentQuestion.question,
        isCorrect: isCorrect,
        index: currentQIndex
      }
    ];
    setAnswersTracker(updatedTracker);

    let nextScore = score;
    if (isCorrect) {
      nextScore = score + 1;
      setScore(prev => prev + 1);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishAssessment(nextScore, updatedTracker);
    }
  };

  const finishAssessment = (finalScore, finalTracker) => {
    setIsFinishing(true);
    
    setTimeout(() => {
      const savedData = JSON.parse(localStorage.getItem("devpath_analysis_result")) || {};
      const totalQuestionsCount = questions.length || 10;
      const scorePercentage = Math.round((finalScore / totalQuestionsCount) * 100);

      // Cập nhật điểm số chung vào cấu trúc hiện tại
      savedData.assessmentScore = `${finalScore}/${totalQuestionsCount}`;
      savedData.assessmentPercent = scorePercentage;
      localStorage.setItem("devpath_analysis_result", JSON.stringify(savedData));

      // ── LOGIC CHUYÊN SÂU: PHÂN TÍCH KHOẢNG CÁCH KỸ NĂNG TỪ BÀI LÀM THỰC TẾ ──
      const matchedSkills = [];
      const missingSkills = [];

      // Khai báo mảng từ khóa nhãn kỹ năng đã được chuẩn hóa để lấy ra theo index, tránh dùng regex thô sơ
      const roleKeywords = skillKeywordsMapping[role] || skillKeywordsMapping["default"];

      finalTracker.forEach((item) => {
        // Lấy trực tiếp nhãn kỹ năng chuyên nghiệp đã chuẩn hóa theo index của câu hỏi
        const skillName = roleKeywords[item.index] || `Kiến thức cấu phần #${item.index + 1}`;

        if (item.isCorrect) {
          matchedSkills.push({
            name: skillName,
            level: Math.floor(Math.random() * 15) + 81 // Tạo dải điểm ngẫu nhiên đẹp từ 81% - 95% cho câu đúng
          });
        } else {
          missingSkills.push({
            name: skillName,
            priority: item.index < 4 ? "Chủ chốt" : "Quan trọng",
            desc: `Bạn cần củng cố lại nền tảng lý thuyết và tư duy thực hành liên quan đến nội dung câu số ${item.index + 1} của bộ đề.`
          });
        }
      });

      // Cơ chế fallback phòng ngừa tập mảng rỗng làm lỗi UI trang sau
      if (matchedSkills.length === 0) {
        matchedSkills.push({ name: "Cấu trúc dữ liệu & Tư duy logic", level: 75 });
      }
      if (missingSkills.length === 0) {
        missingSkills.push({ name: "Tối ưu hiệu năng kiến trúc hệ thống chuyên sâu", priority: "Mở rộng", desc: "Nâng cấp kỹ năng cấu trúc toàn cục tối ưu hóa tài nguyên." });
      }

      // Đóng gói payload phân tích Khoảng cách kỹ năng động
      const skillGapPayload = {
        role: role,
        matchPercentage: scorePercentage,
        matchedSkills: matchedSkills,
        missingSkills: missingSkills
      };
      
      // Lưu trữ vào key riêng để trang SkillGap.jsx hứng đọc độc lập
      localStorage.setItem("skill_gap_result", JSON.stringify(skillGapPayload));

      // ── THAY ĐỔI THEO LUỒNG NGƯỜI DÙNG CHUẨN ──
      // Sau khi làm bài test, nhảy sang trang Nhận đề xuất lộ trình nghề nghiệp trước
      navigate("/roadmap");
    }, 2000);
  };

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#070b14] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#00e5ff]" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      <div 
        className={`flex flex-col justify-between flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide mb-6">
          <span className="text-white">DevPath</span>
          <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
        </div>

        {/* Main Card Container */}
        <div className="mx-auto flex w-full max-w-4xl md:h-[600px] overflow-hidden rounded-2xl border border-gray-800/50 bg-[#0d1527]/80 shadow-2xl backdrop-blur-md my-auto">
          
          {/* Left Side: Thống kê và Tiến trình */}
          <div className="hidden w-1/3 flex-col justify-between bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#112544] via-[#0d1527] to-[#0d1527] p-8 md:flex border-r border-gray-800/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#00e5ff] bg-[#00e5ff]/10 px-3 py-1.5 rounded-lg w-max border border-[#00e5ff]/20">
                <BrainCircuit className="h-4 w-4" />
                <span>AI Assessment</span>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
                Đánh giá <br />
                <span className="text-[#00e5ff]">Năng lực Số</span>
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hệ thống đang kiểm tra lỗ hổng kiến thức chuyên môn dựa trên vị trí ứng tuyển mục tiêu của bạn.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="bg-[#070c16]/60 p-3.5 rounded-xl border border-gray-800/60">
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Chuyên ngành định hướng</span>
                <span className="text-sm font-semibold text-gray-200 truncate block">{role}</span>
              </div>
              <div className="bg-[#070c16]/60 p-3.5 rounded-xl border border-gray-800/60">
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 font-sans">Tiến trình làm đề</span>
                <div className="flex items-center justify-between font-mono text-xs text-gray-300 font-semibold mb-1.5">
                  <span>Câu hỏi</span>
                  <span>{currentQIndex + 1} / {questions.length}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] transition-all duration-300 ease-out"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Biểu mẫu câu hỏi */}
          <div className="w-full p-8 md:w-2/3 md:p-10 flex flex-col justify-between bg-[#0d1527]/40">
            {isFinishing ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#00e5ff]" />
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-bold">Hệ thống đang chấm điểm...</h4>
                  <p className="text-xs text-gray-400">AI đang phân tích các đáp án để đo lường khoảng cách kỹ năng và lập lộ trình của bạn.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quiz Question</span>
                    <span className="text-xs text-gray-500 font-mono">Bắt buộc</span>
                  </div>
                  
                  <h3 className="text-base font-bold leading-relaxed text-gray-100 min-h-[56px]">
                    {questions[currentQIndex]?.question}
                  </h3>

                  <div className="space-y-2.5">
                    {questions[currentQIndex]?.options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(index)}
                          className={`w-full text-left p-3.5 text-sm rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                            isSelected
                              ? "bg-[#00e5ff]/10 border-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                              : "bg-[#0a101f] border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-[#11192e]"
                          }`}
                        >
                          <span className="pr-4 leading-relaxed">{option}</span>
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? "border-[#00e5ff] bg-[#00e5ff]" : "border-gray-600 group-hover:border-gray-400"
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span>Không thể hoàn tác sau khi bấm Tiếp tục</span>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-black transition-all active:scale-[0.98] ${
                      selectedOption !== null
                        ? "bg-[#00e5ff] hover:bg-[#00b2cc]"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50"
                    }`}
                  >
                    <span>{currentQIndex === questions.length - 1 ? "Nộp bài" : "Tiếp tục"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-6">
          <span>DevPath AI</span>
          <span>Dự án sinh viên — EAUT · Đội DevPath AI - 2025</span>
        </div>
      </div>
    </div>
  );
}